// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Strings  library
library Strings {
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

contract OnchainTamagotchi {
    enum Stage {
        Baby,
        Teen,
        Adult,
        Sick,
        Dead
    }

    enum Personality {
        Shy,
        Bold,
        Lazy,
        Cheerful,
        Grumpy
    }
    enum MiniGame {
        TugOfWar,
        HideAndSeek,
        Trivia,
        DanceOff
    }

    struct Achievements {
        bool reachedTeen;
        bool reachedAdult;
        bool neverSick;
        bool survivedOneDay;
        bool poopMaster;
        bool socialButterfly;
        bool resurrectionHero;
    }

    struct Pet {
        uint256 bornAt;
        uint256 lastFed;
        uint256 lastPlayed;
        uint256 lastSlept;
        uint256 hunger; // 0-100
        uint256 happiness; // 0-100
        uint256 energy; // 0-100
        uint256 cleanliness; // 0-100
        uint256 xp;
        Stage stage;
        bool alive;
        string name;
        Achievements achievements;
        bool revivedOnce;
        uint256 activeQuestId;
        uint256 questProgress;
    }

    struct Quest {
        string name;
        string description;
        uint256 goalXP;
        string rewardItem;
    }

    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => bool)) public completedQuests;
    mapping(address => Pet) public pets;
    mapping(address => mapping(address => uint256)) public lastVisitTime;
    mapping(address => uint256) public friendVisitCount;
    mapping(address => mapping(address => bool)) public hasVisited;
    mapping(address => string[]) public inventory;
    mapping(address => string) public equippedItem;

    uint256 constant FEED_COOLDOWN = 1 hours;
    uint256 constant PLAY_COOLDOWN = 2 hours;
    uint256 constant SLEEP_COOLDOWN = 6 hours;
    uint256 lastStatUpdate;
    string name;
    uint256 constant VISIT_COOLDOWN = 12 hours;
    string[] public defaultItems = [
        "Hat",
        "Sunglasses",
        "Bowtie",
        "Cape",
        "Crown"
    ];

    event ItemEquipped(address indexed user, string item);
    event ItemUnequipped(address indexed user);
    event FriendVisited(address indexed visitor, address indexed friend);
    event PetCreated(address indexed owner);
    event PetFed(address indexed owner, uint256 newHunger);
    event PetPlayed(address indexed owner, uint256 newHappiness);
    event PetSlept(address indexed owner, uint256 newEnergy);
    event PetEvolved(address indexed owner, Stage newStage);
    event PetDied(address indexed owner);
    event CustomAction(address indexed user, string action, uint256 timestamp);
    event PetRenamed(address indexed owner, string newName);
    event AchievementUnlocked(address indexed owner, string achievement);

    modifier onlyAlive() {
        require(pets[msg.sender].alive, "Your pet is dead.");
        _;
    }

    function createPet() external {
        require(!pets[msg.sender].alive, "You already have a pet.");

        Achievements memory achievements = Achievements({
            reachedTeen: false,
            reachedAdult: false,
            neverSick: true,
            survivedOneDay: false,
            poopMaster: false,
            socialButterfly: false,
            resurrectionHero: false
        });

        pets[msg.sender] = Pet({
            bornAt: block.timestamp,
            lastFed: block.timestamp,
            lastPlayed: block.timestamp,
            lastSlept: block.timestamp,
            hunger: 100,
            happiness: 100,
            energy: 100,
            cleanliness: 100,
            xp: 0,
            stage: Stage.Baby,
            alive: true,
            name: "",
            achievements: achievements,
            revivedOnce: false,
            activeQuestId: 0,
            questProgress: 0
        });

        emit PetCreated(msg.sender);
    }

    function setName(string memory newName) external onlyAlive {
        require(
            bytes(newName).length > 0 && bytes(newName).length <= 32,
            "Name must be 1-32 characters."
        );
        pets[msg.sender].name = newName;
        emit PetRenamed(msg.sender, newName);
    }

    function equipItem(string memory item) external onlyAlive {
        bool hasItem = false;
        for (uint256 i = 0; i < inventory[msg.sender].length; i++) {
            if (
                keccak256(bytes(inventory[msg.sender][i])) ==
                keccak256(bytes(item))
            ) {
                hasItem = true;
                break;
            }
        }
        require(hasItem, "Item not owned.");
        equippedItem[msg.sender] = item;
        emit ItemEquipped(msg.sender, item);
    }

    function unequipItem() external onlyAlive {
        equippedItem[msg.sender] = "";
        emit ItemUnequipped(msg.sender);
    }

    function grantItem(address user, string memory item) public {
        // Optional: onlyOwner modifier or use for achievements
        inventory[user].push(item);
    }

    function hasItem(
        address user,
        string memory item
    ) internal view returns (bool) {
        for (uint256 i = 0; i < inventory[user].length; i++) {
            if (
                keccak256(bytes(inventory[user][i])) == keccak256(bytes(item))
            ) {
                return true;
            }
        }
        return false;
    }

    function revive() external {
        Pet storage pet = pets[msg.sender];
        require(!pet.alive, "Pet is still alive.");
        require(!pet.revivedOnce, "Pet already revived once.");

        pet.alive = true;
        pet.hunger = 50;
        pet.energy = 50;
        pet.cleanliness = 50;
        pet.happiness = 50;
        pet.stage = Stage.Baby;
        pet.revivedOnce = true;

        if (!pet.achievements.resurrectionHero) {
            pet.achievements.resurrectionHero = true;
        }

        emit CustomAction(msg.sender, "revived", block.timestamp);
        emit AchievementUnlocked(msg.sender, "Back From the Dead");
    }

    function feed() external onlyAlive {
        Pet storage pet = pets[msg.sender];
        require(
            block.timestamp >= pet.lastFed + FEED_COOLDOWN,
            "Pet not hungry yet."
        );
        pet.hunger = min(pet.hunger + 20, 100);
        pet.cleanliness = pet.cleanliness > 10 ? pet.cleanliness - 10 : 0;
        pet.lastFed = block.timestamp;
        pet.xp += 5;
        emit PetFed(msg.sender, pet.hunger);
        checkEvolution(msg.sender);
    }

    function play() external onlyAlive {
        Pet storage pet = pets[msg.sender];
        require(
            block.timestamp >= pet.lastPlayed + PLAY_COOLDOWN,
            "Pet needs rest."
        );
        pet.happiness = min(pet.happiness + 15, 100);
        pet.energy = pet.energy > 20 ? pet.energy - 20 : 0;
        pet.lastPlayed = block.timestamp;
        pet.xp += 10;
        emit PetPlayed(msg.sender, pet.happiness);
        checkEvolution(msg.sender);
    }

    function sleep() external onlyAlive {
        Pet storage pet = pets[msg.sender];
        require(
            block.timestamp >= pet.lastSlept + SLEEP_COOLDOWN,
            "Pet not sleepy yet."
        );
        pet.energy = min(pet.energy + 50, 100);
        pet.hunger = pet.hunger > 15 ? pet.hunger - 15 : 0;
        pet.lastSlept = block.timestamp;
        pet.xp += 8;
        emit PetSlept(msg.sender, pet.energy);
        checkEvolution(msg.sender);
    }

    function visitFriend(address friend) external onlyAlive {
        require(friend != msg.sender, "You cannot visit yourself.");
        require(pets[friend].alive, "Friend's pet is not alive.");
        require(
            block.timestamp >=
                lastVisitTime[msg.sender][friend] + VISIT_COOLDOWN,
            "You already visited this friend recently."
        );

        Pet storage target = pets[friend];
        target.happiness = min(target.happiness + 10, 100);
        target.cleanliness = min(target.cleanliness + 5, 100);
        target.xp += 5;

        lastVisitTime[msg.sender][friend] = block.timestamp;
        if (!hasVisited[msg.sender][friend]) {
            hasVisited[msg.sender][friend] = true;
            friendVisitCount[msg.sender]++;

            if (
                friendVisitCount[msg.sender] >= 5 &&
                !pets[msg.sender].achievements.socialButterfly
            ) {
                pets[msg.sender].achievements.socialButterfly = true;
                emit AchievementUnlocked(msg.sender, "Social Butterfly");
            }
        }

        emit FriendVisited(msg.sender, friend);
    }

    function startQuest(uint256 questId) external onlyAlive {
        require(questId < totalQuests(), "Invalid quest.");
        require(!completedQuests[msg.sender][questId], "Already completed.");

        Pet storage pet = pets[msg.sender];
        pet.activeQuestId = questId;
        pet.questProgress = 0;
    }

    function updateQuestProgress(address owner, uint256 xpGained) internal {
        Pet storage pet = pets[owner];
        if (completedQuests[owner][pet.activeQuestId]) return;

        pet.questProgress += xpGained;
        Quest memory quest = quests[pet.activeQuestId];
        if (pet.questProgress >= quest.goalXP) {
            completedQuests[owner][pet.activeQuestId] = true;
            grantItem(owner, quest.rewardItem);
            emit AchievementUnlocked(
                owner,
                string(abi.encodePacked("Completed Quest: ", quest.name))
            );
        }
    }

    function totalQuests() public pure returns (uint256) {
        return 3; // Static for now
    }

    function checkEvolution(address owner) internal {
        Pet storage pet = pets[owner];
        // if (pet.stage == Stage.Baby && pet.xp >= 100) {
        //     pet.stage = Stage.Teen;
        //     emit PetEvolved(owner, pet.stage);
        // } else if (pet.stage == Stage.Teen && pet.xp >= 300) {
        //     pet.stage = Stage.Adult;
        //     emit PetEvolved(owner, pet.stage);
        // }
        if (pet.stage == Stage.Baby && pet.xp >= 100) {
            pet.stage = Stage.Teen;
            emit PetEvolved(owner, pet.stage);
            if (!pet.achievements.reachedTeen) {
                pet.achievements.reachedTeen = true;
                emit AchievementUnlocked(owner, "Reached Teen");
            }
        } else if (pet.stage == Stage.Teen && pet.xp >= 300) {
            pet.stage = Stage.Adult;
            emit PetEvolved(owner, pet.stage);
            if (!pet.achievements.reachedAdult) {
                pet.achievements.reachedAdult = true;
                emit AchievementUnlocked(owner, "Reached Adult");
            }
        }

        if (pet.achievements.reachedAdult && !hasItem(owner, "Crown")) {
            grantItem(owner, "Crown");
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function poop() external onlyAlive {
        Pet storage pet = pets[msg.sender];
        require(pet.cleanliness >= 10, "Already dirty.");
        pet.cleanliness -= 10;
        pet.happiness = pet.happiness > 5 ? pet.happiness - 5 : 0;

        // Bonus poop tracker
        if (!pet.achievements.poopMaster && pet.xp >= 150) {
            pet.achievements.poopMaster = true;
            emit AchievementUnlocked(msg.sender, "Poop Master ");
        }

        emitAction("poop");
        checkSickness(msg.sender);
    }

    function clean() external onlyAlive {
        Pet storage pet = pets[msg.sender];
        require(pet.cleanliness < 100, "Already clean.");
        pet.cleanliness = 100;
        pet.happiness += 3;
        emitAction("clean");
    }

    function checkSickness(address owner) internal {
        Pet storage pet = pets[owner];
        if (pet.cleanliness < 20 && pet.hunger < 30 && pet.energy < 20) {
            pet.stage = Stage.Sick;
            pet.achievements.neverSick = false; // Lose this if they ever get sick
            emit PetEvolved(owner, pet.stage);
        }
    }

    function checkVitals(address owner) public {
        Pet storage pet = pets[owner];
        if (
            pet.hunger == 0 ||
            pet.energy == 0 ||
            pet.cleanliness == 0 ||
            pet.happiness == 0
        ) {
            pet.stage = Stage.Dead;
            pet.alive = false;
            emit PetDied(owner);
        }
        if (
            !pet.achievements.survivedOneDay &&
            block.timestamp >= pet.bornAt + 1 days
        ) {
            pet.achievements.survivedOneDay = true;
            emit AchievementUnlocked(owner, "Survived 1 Day");
        }
    }

    function emitAction(string memory action) internal {
        emit CustomAction(msg.sender, action, block.timestamp);
    }

    function getColor(Stage stage) internal pure returns (string memory) {
        if (stage == Stage.Dead) return "gray";
        if (stage == Stage.Sick) return "purple";
        if (stage == Stage.Teen) return "orange";
        if (stage == Stage.Adult) return "blue";
        return "green"; // Baby
    }

    function getMood(
        Stage stage,
        uint256 happiness
    ) internal pure returns (string memory) {
        if (stage == Stage.Dead) return "X_X";
        if (stage == Stage.Sick) return "-_-";
        if (happiness > 70) return "^_^";
        if (happiness > 30) return "-.-";
        return "T_T";
    }

    function getBackground(Stage stage) internal pure returns (string memory) {
        if (stage == Stage.Baby) return "#FFF8DC";
        if (stage == Stage.Teen) return "#E0FFFF";
        if (stage == Stage.Adult) return "#FFD700";
        if (stage == Stage.Sick) return "#8B0000";
        return "#2F4F4F"; // Dead
    }

    /* function renderSVG(address owner) public view returns (string memory) {
        Pet storage pet = pets[owner];
        string memory color = getColor(pet.stage);
        string memory background = getBackground(pet.stage);
        string memory mood = getMood(pet.stage, pet.happiness);

        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
                '<rect width="100%" height="100%" fill="',
                color,
                background,
                '" />',
                '<text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="white">',
                pet.name,
                "</text>",
                '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">',
                mood,
                "</text>",
                '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="white">XP: ',
                Strings.toString(pet.xp),
                "</text>",
                renderBar(pet.hunger, 100, "Hunger", 180),
                renderBar(pet.energy, 100, "Energy", 200),
                renderBar(pet.cleanliness, 100, "Cleanliness", 220),
                renderBar(pet.happiness, 100, "Happiness", 240)
            )
        );

        string memory item = equippedItem[owner];
        if (bytes(item).length > 0) {
            svg = string(
                abi.encodePacked(
                    svg,
                    '<text x="50%" y="80%" text-anchor="middle" font-size="10" fill="white">Equipped: ',
                    item,
                    "</text>"
                )
            );
        }

        if (pet.revivedOnce) {
            svg = string(
                abi.encodePacked(
                    svg,
                    '<text x="50%" y="90%" text-anchor="middle" font-size="10" fill="yellow">Revived</text>'
                )
            );
        }

        svg = string(abi.encodePacked(svg, "</svg>"));
        return svg;
    }

    function tokenURI(address owner) public view returns (string memory) {
        Pet storage pet = pets[owner];

        string memory svg = renderSVG(owner);
        string memory image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(svg))
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                bytes(pet.name).length > 0 ? pet.name : "Unnamed Pet",
                '", "description": "A fully onchain Tamagotchi-style pet.", "image": "',
                image,
                '", "attributes": [{"trait_type": "Stage", "value": "',
                stageToString(pet.stage),
                '"}, {"trait_type": "XP", "value": "',
                Strings.toString(pet.xp),
                '"}]}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }
    */
    function renderSVG(address owner) public view returns (string memory) {
        Pet storage pet = pets[owner];
        string memory item = equippedItem[owner];

        string memory head = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
                '<rect width="100%" height="100%" fill="',
                getColor(pet.stage),
                getBackground(pet.stage),
                '" />',
                '<text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="white">',
                pet.name,
                "</text>",
                '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">',
                getMood(pet.stage, pet.happiness),
                "</text>",
                '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="white">XP: ',
                Strings.toString(pet.xp),
                "</text>"
            )
        );

        string memory bars = string(
            abi.encodePacked(
                renderBar(pet.hunger, 100, "Hunger", 180),
                renderBar(pet.energy, 100, "Energy", 200),
                renderBar(pet.cleanliness, 100, "Cleanliness", 220),
                renderBar(pet.happiness, 100, "Happiness", 240)
            )
        );

        string memory extra = "";
        if (bytes(item).length > 0) {
            extra = string(
                abi.encodePacked(
                    extra,
                    '<text x="50%" y="80%" text-anchor="middle" font-size="10" fill="white">Equipped: ',
                    item,
                    "</text>"
                )
            );
        }

        if (pet.revivedOnce) {
            extra = string(
                abi.encodePacked(
                    extra,
                    '<text x="50%" y="90%" text-anchor="middle" font-size="10" fill="yellow">Revived</text>'
                )
            );
        }

        return string(abi.encodePacked(head, bars, extra, "</svg>"));
    }

    function tokenURI(address owner) public view returns (string memory) {
        Pet storage pet = pets[owner];

        string memory svg = renderSVG(owner);
        string memory image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(svg))
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                bytes(pet.name).length > 0 ? pet.name : "Unnamed Pet",
                '", "description": "A fully onchain Tamagotchi-style pet.", "image": "',
                image,
                '", "attributes": [{"trait_type": "Stage", "value": "',
                stageToString(pet.stage),
                '"}, {"trait_type": "XP", "value": "',
                Strings.toString(pet.xp),
                '"}]}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }

    function renderBar(
        uint256 value,
        uint256 max,
        string memory label,
        uint256 y
    ) internal pure returns (string memory) {
        uint256 width = (value * 100) / max;
        return
            string(
                abi.encodePacked(
                    '<text x="10" y="',
                    Strings.toString(y),
                    '" font-size="10" fill="white">',
                    label,
                    "</text>",
                    '<rect x="60" y="',
                    Strings.toString(y - 8),
                    '" width="100" height="10" fill="#555" />',
                    '<rect x="60" y="',
                    Strings.toString(y - 8),
                    '" width="',
                    Strings.toString(width),
                    '" height="10" fill="#0f0" />'
                )
            );
    }

    /*function renderSVG(address owner) public view returns (string memory) {
        Pet memory pet = pets[owner];
        string memory color = pet.stage == Stage.Dead
            ? "gray"
            : pet.stage == Stage.Sick
            ? "purple"
            : pet.stage == Stage.Teen
            ? "orange"
            : pet.stage == Stage.Adult
            ? "blue"
            : "green";

        string memory mood = pet.stage == Stage.Dead
            ? "X_X"
            : pet.stage == Stage.Sick
            ? "-_-"
            : pet.happiness > 70
            ? "^_^"
            : pet.happiness > 30
            ? "-.-"
            : "T_T";

            string memory background = pet.stage == Stage.Baby ? "#FFF8DC" :
                            pet.stage == Stage.Teen ? "#E0FFFF" :
                            pet.stage == Stage.Adult ? "#FFD700" :
                            pet.stage == Stage.Sick ? "#8B0000" : "#2F4F4F";

        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
                '<rect width="100%" height="100%" fill="',
                color,
                '" />',
                pet.name,
                '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">',
                mood,
                "</text>",
                '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="white">',
                "XP: ",
                Strings.toString(pet.xp),
                "</text>",
                "</svg>",
                            string memory item = equippedItem[owner];
if (bytes(item).length > 0) {
    svg = string(
        abi.encodePacked(
            svg,
            '<text x="50%" y="80%" text-anchor="middle" font-size="10" fill="white">Equipped: ',
            item,
            "</text>"
        )
    );
}
            )

        );

        return svg;
    }
    */

    /*function renderSVG(address owner) public view returns (string memory) {
        Pet storage pet = pets[owner];
        string memory color = pet.stage == Stage.Dead
            ? "gray"
            : pet.stage == Stage.Sick
            ? "purple"
            : pet.stage == Stage.Teen
            ? "orange"
            : pet.stage == Stage.Adult
            ? "blue"
            : "green";

        string memory mood = pet.stage == Stage.Dead
            ? "X_X"
            : pet.stage == Stage.Sick
            ? "-_-"
            : pet.happiness > 70
            ? "^_^"
            : pet.happiness > 30
            ? "-.-"
            : "T_T";

        string memory background = pet.stage == Stage.Baby
            ? "#FFF8DC"
            : pet.stage == Stage.Teen
            ? "#E0FFFF"
            : pet.stage == Stage.Adult
            ? "#FFD700"
            : pet.stage == Stage.Sick
            ? "#8B0000"
            : "#2F4F4F";

        string memory item = equippedItem[owner];

        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
                '<rect width="100%" height="100%" fill="',
                color,
                background,
                '" />',
                '<text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="white">',
                pet.name,
                "</text>",
                '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">',
                mood,
                "</text>",
                '<text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="white">XP: ',
                Strings.toString(pet.xp),
                "</text>"
            )
        );

        svg = string(
            abi.encodePacked(
                svg,
                renderBar(pet.hunger, 100, "Hunger", 180),
                renderBar(pet.energy, 100, "Energy", 200),
                renderBar(pet.cleanliness, 100, "Cleanliness", 220),
                renderBar(pet.happiness, 100, "Happiness", 240)
            )
        );

        if (bytes(item).length > 0) {
            svg = string(
                abi.encodePacked(
                    svg,
                    '<text x="50%" y="80%" text-anchor="middle" font-size="10" fill="white">Equipped: ',
                    item,
                    "</text>"
                )
            );
        }

        if (pet.revivedOnce) {
            svg = string(
                abi.encodePacked(
                    svg,
                    '<text x="50%" y="90%" text-anchor="middle" font-size="10" fill="yellow"> Revived</text>'
                )
            );
        }

        svg = string(abi.encodePacked(svg, "</svg>"));
        return svg;
    }
    */

    /* function tokenURI(address owner) public view returns (string memory) {
        Pet memory pet = pets[owner]; // Add this line near the top of tokenURI()

        string memory svg = renderSVG(owner);
        string memory image = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(svg))
            )
        );

        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                bytes(pet.name).length > 0 ? pet.name : "Unnamed Pet",
                '", "description": "A fully onchain Tamagotchi-style pet.", "image": "',
                image,
                '", "attributes": [{"trait_type": "Stage", "value": "',
                stageToString(pet.stage),
                '"}, {"trait_type": "XP", "value": "',
                Strings.toString(pet.xp),
                '"}]}'
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    } */

    function applyDecay(address owner) internal {
        Pet storage pet = pets[owner];
        uint256 hoursPassed = (block.timestamp - pet.lastFed) / 1 hours;
        if (hoursPassed > 0) {
            pet.hunger = pet.hunger > hoursPassed * 5
                ? pet.hunger - hoursPassed * 5
                : 0;
            pet.energy = pet.energy > hoursPassed * 3
                ? pet.energy - hoursPassed * 3
                : 0;
            pet.cleanliness = pet.cleanliness > hoursPassed * 2
                ? pet.cleanliness - hoursPassed * 2
                : 0;
            checkVitals(owner);
        }
    }

    function petStats(
        address owner
    )
        external
        view
        returns (
            uint256 hunger,
            uint256 happiness,
            uint256 energy,
            uint256 cleanliness,
            uint256 xp,
            string memory petName,
            string memory equipped,
            bool revived
        )
    {
        Pet storage pet = pets[owner];
        hunger = pet.hunger;
        happiness = pet.happiness;
        energy = pet.energy;
        cleanliness = pet.cleanliness;
        xp = pet.xp;
        petName = pet.name;
        equipped = equippedItem[owner];
        revived = pet.revivedOnce;
    }

    function stageToString(Stage stage) internal pure returns (string memory) {
        if (stage == Stage.Baby) return "Baby";
        if (stage == Stage.Teen) return "Teen";
        if (stage == Stage.Adult) return "Adult";
        if (stage == Stage.Sick) return "Sick";
        return "Dead";
    }
}

/// @notice Base64 encoding library (compact version, MIT License)
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        string memory result = new string(encodedLen + 32);
        bytes memory table = TABLE;

        assembly ("memory-safe") {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                out := shl(8, out)
                out := add(out, mload(add(tablePtr, and(input, 0x3F))))
                out := shl(224, out)

                mstore(resultPtr, out)
                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            } // '=='
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            } // '='

            mstore(result, encodedLen)
        }

        return result;
    }
}

// pragma solidity ^0.8.24;

// library Strings {
//     function toString(uint256 value) internal pure returns (string memory) {
//         if (value == 0) return "0";
//         uint256 temp = value;
//         uint256 digits;
//         while (temp != 0) {
//             digits++;
//             temp /= 10;
//         }
//         bytes memory buffer = new bytes(digits);
//         while (value != 0) {
//             digits -= 1;
//             buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
//             value /= 10;
//         }
//         return string(buffer);
//     }
// }

// contract OnchainTamagotchi {
//     enum Stage {
//         Baby,
//         Teen,
//         Adult,
//         Elder,
//         Sick,
//         Dead
//     }
//     enum Personality {
//         Shy,
//         Bold,
//         Lazy,
//         Cheerful,
//         Grumpy
//     }
//     enum MiniGame {
//         TugOfWar,
//         HideAndSeek,
//         Trivia,
//         DanceOff
//     }

//     struct Achievements {
//         bool reachedElder;
//         bool masterTrainer;
//         bool itemCollector;
//         bool questLegend;
//         bool socialStar;
//         bool miniGameChamp;
//         bool breedingExpert;
//         bool survivedOneDay;
//         bool neverSick;
//         bool resurrectionHero;
//     }

//     struct Pet {
//         uint256 bornAt;
//         uint256 lastFed;
//         uint256 lastPlayed;
//         uint256 lastSlept;
//         uint256 hunger;
//         uint256 happiness;
//         uint256 energy;
//         uint256 cleanliness;
//         uint256 strength;
//         uint256 xp;
//         Stage stage;
//         Personality personality;
//         bool alive;
//         string name;
//         Achievements achievements;
//         bool revivedOnce;
//         uint256 activeQuestId;
//         uint256 questProgress;
//         uint256 parent1Id;
//         uint256 parent2Id;
//         uint256 petId;
//     }

//     struct Quest {
//         string name;
//         string description;
//         uint256 goalXP;
//         string rewardItem;
//         uint256 difficulty;
//     }

//     struct Item {
//         string name;
//         string category;
//         uint256 boostValue;
//         string svgCode;
//     }

//     struct MiniGameResult {
//         uint256 score;
//         uint256 timestamp;
//         MiniGame gameType;
//         bool won;
//     }

//     uint256 public totalPets;
//     uint256 constant FEED_COOLDOWN = 1 hours;
//     uint256 constant PLAY_COOLDOWN = 2 hours;
//     uint256 constant SLEEP_COOLDOWN = 6 hours;
//     uint256 constant VISIT_COOLDOWN = 12 hours;
//     uint256 constant BREED_COOLDOWN = 24 hours;

//     mapping(address => Pet) public pets;
//     mapping(uint256 => Quest) public quests;
//     mapping(uint256 => Item) public items;
//     mapping(address => uint256[]) public ownedItemIds;
//     mapping(address => string) public equippedItem;
//     mapping(address => mapping(uint256 => bool)) public completedQuests;
//     mapping(address => mapping(address => uint256)) public lastVisitTime;
//     mapping(address => mapping(address => bool)) public hasVisited;
//     mapping(address => MiniGameResult[]) public miniGameHistory;
//     mapping(address => uint256) public friendVisitCount;
//     mapping(uint256 => address) public petIdToOwner;

//     string[] public defaultItems = [
//         "Wizard Hat",
//         "Sunglasses",
//         "Bowtie",
//         "Cape",
//         "Crown",
//         "Golden Bone",
//         "Magic Wand",
//         "Disco Ball",
//         "Feather Boa",
//         "Treasure Chest"
//     ];

//     event PetCreated(address indexed owner, uint256 petId);
//     event PetFed(address indexed owner, uint256 newHunger);
//     event PetPlayed(address indexed owner, uint256 newHappiness);
//     event PetSlept(address indexed owner, uint256 newEnergy);
//     event PetEvolved(address indexed owner, Stage newStage);
//     event PetDied(address indexed owner);
//     event MiniGamePlayed(address indexed player, MiniGame game, uint256 score);
//     event PetBred(
//         address indexed owner,
//         uint256 petId1,
//         uint256 petId2,
//         uint256 newPetId
//     );
//     event ItemCrafted(address indexed owner, uint256 itemId);

//     modifier onlyAlive() {
//         require(pets[msg.sender].alive, "Your pet is dead.");
//         _;
//     }

//     constructor() {
//         quests[0] = Quest(
//             "Food Hunt",
//             "Feed your pet 10 times.",
//             50,
//             "Golden Bone",
//             1
//         );
//         quests[1] = Quest(
//             "Playtime Pro",
//             "Play 15 times.",
//             75,
//             "Disco Ball",
//             2
//         );
//         quests[2] = Quest(
//             "Social Quest",
//             "Visit 5 friends.",
//             100,
//             "Feather Boa",
//             3
//         );

//         items[0] = Item(
//             "Wizard Hat",
//             "Wearable",
//             10,
//             "<circle cx='50' cy='50' r='20' fill='purple'/>"
//         );
//         items[1] = Item(
//             "Golden Bone",
//             "Consumable",
//             20,
//             "<rect x='40' y='40' width='20' height='10' fill='gold'/>"
//         );
//         items[2] = Item(
//             "Disco Ball",
//             "Trophy",
//             15,
//             "<circle cx='50' cy='50' r='15' fill='silver'/>"
//         );
//     }

//     function createPet(string memory _name) external {
//         require(!pets[msg.sender].alive, "You already have a pet.");
//         totalPets++;
//         pets[msg.sender] = Pet({
//             bornAt: block.timestamp,
//             lastFed: block.timestamp,
//             lastPlayed: block.timestamp,
//             lastSlept: block.timestamp,
//             hunger: 100,
//             happiness: 100,
//             energy: 100,
//             cleanliness: 100,
//             strength: 50,
//             xp: 0,
//             stage: Stage.Baby,
//             personality: Personality(
//                 uint256(
//                     keccak256(abi.encodePacked(block.timestamp, msg.sender))
//                 ) % 5
//             ),
//             alive: true,
//             name: _name,
//             achievements: Achievements(
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 true,
//                 false
//             ),
//             revivedOnce: false,
//             activeQuestId: 0,
//             questProgress: 0,
//             parent1Id: 0,
//             parent2Id: 0,
//             petId: totalPets
//         });
//         petIdToOwner[totalPets] = msg.sender;
//         emit PetCreated(msg.sender, totalPets);
//     }

//     function feed() external onlyAlive {
//         Pet storage pet = pets[msg.sender];
//         require(
//             block.timestamp >= pet.lastFed + FEED_COOLDOWN,
//             "Pet not hungry yet."
//         );
//         pet.hunger = pet.hunger + 20 > 100 ? 100 : pet.hunger + 20;
//         pet.cleanliness = pet.cleanliness > 10 ? pet.cleanliness - 10 : 0;
//         pet.lastFed = block.timestamp;
//         pet.xp += 5;
//         emit PetFed(msg.sender, pet.hunger);
//         checkEvolution(msg.sender);
//     }

//     function playMiniGame(MiniGame game) external onlyAlive {
//         Pet storage pet = pets[msg.sender];
//         require(
//             block.timestamp >= pet.lastPlayed + PLAY_COOLDOWN,
//             "Pet needs rest."
//         );
//         uint256 score = calculateMiniGameScore(pet, game);
//         pet.happiness = min(pet.happiness + score / 5, 100);
//         pet.energy = pet.energy > 20 ? pet.energy - 20 : 0;
//         pet.strength += score / 10;
//         pet.lastPlayed = block.timestamp;
//         pet.xp += score;
//         miniGameHistory[msg.sender].push(
//             MiniGameResult(score, block.timestamp, game, score > 50)
//         );
//         emit MiniGamePlayed(msg.sender, game, score);
//         checkEvolution(msg.sender);
//     }

//     function breedPets(address partner) external onlyAlive {
//         Pet storage pet1 = pets[msg.sender];
//         Pet storage pet2 = pets[partner];
//         require(pet2.alive, "Partner's pet must be alive.");
//         require(
//             pet1.stage >= Stage.Adult && pet2.stage >= Stage.Adult,
//             "Both pets must be adults."
//         );
//         require(
//             block.timestamp >= pet1.lastPlayed + BREED_COOLDOWN,
//             "Breeding cooldown active."
//         );
//         totalPets++;
//         Pet memory newPet = Pet({
//             bornAt: block.timestamp,
//             lastFed: block.timestamp,
//             lastPlayed: block.timestamp,
//             lastSlept: block.timestamp,
//             hunger: 100,
//             happiness: 100,
//             energy: 100,
//             cleanliness: 100,
//             strength: (pet1.strength + pet2.strength) / 2,
//             xp: 0,
//             stage: Stage.Baby,
//             personality: Personality(
//                 uint256(
//                     keccak256(abi.encodePacked(block.timestamp, totalPets))
//                 ) % 5
//             ),
//             alive: true,
//             name: string(abi.encodePacked(pet1.name, "-", pet2.name)),
//             achievements: Achievements(
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 false,
//                 true,
//                 false
//             ),
//             revivedOnce: false,
//             activeQuestId: 0,
//             questProgress: 0,
//             parent1Id: pet1.petId,
//             parent2Id: pet2.petId,
//             petId: totalPets
//         });
//         pets[msg.sender] = newPet;
//         petIdToOwner[totalPets] = msg.sender;
//         pet1.lastPlayed = block.timestamp;
//         pet2.xp += 20;
//         emit PetBred(msg.sender, pet1.petId, pet2.petId, totalPets);
//     }

//     function equipItem(string memory itemName) external onlyAlive {
//         uint256 id = uint256(keccak256(bytes(itemName))) % 10;
//         require(ownsItem(msg.sender, id), "You don't own this item.");
//         equippedItem[msg.sender] = itemName;
//     }

//     function unequipItem() external onlyAlive {
//         equippedItem[msg.sender] = "";
//     }

//     function craftItem(uint256 itemId1, uint256 itemId2) external onlyAlive {
//         require(
//             ownsItem(msg.sender, itemId1) && ownsItem(msg.sender, itemId2),
//             "Items not owned."
//         );
//         uint256 newItemId = uint256(
//             keccak256(abi.encodePacked(itemId1, itemId2))
//         ) % 10;
//         ownedItemIds[msg.sender].push(newItemId);
//         emit ItemCrafted(msg.sender, newItemId);
//     }

//     function startQuest(uint256 questId) external onlyAlive {
//         require(!completedQuests[msg.sender][questId], "Already completed.");
//         pets[msg.sender].activeQuestId = questId;
//         pets[msg.sender].questProgress = 0;
//     }

//     function updateQuestProgress(address owner, uint256 xpGained) internal {
//         Pet storage pet = pets[owner];
//         if (completedQuests[owner][pet.activeQuestId]) return;
//         pet.questProgress += xpGained;
//         Quest memory quest = quests[pet.activeQuestId];
//         if (pet.questProgress >= quest.goalXP) {
//             completedQuests[owner][pet.activeQuestId] = true;
//             ownedItemIds[owner].push(
//                 uint256(keccak256(abi.encodePacked(quest.rewardItem))) % 10
//             );
//         }
//     }

//     function renderSVG(address owner) public view returns (string memory) {
//         Pet storage pet = pets[owner];
//         string memory mood = getMood(pet.stage, pet.happiness);
//         string memory svg = string(
//             abi.encodePacked(
//                 '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">',
//                 '<rect width="100%" height="100%" fill="',
//                 getBackground(pet.stage),
//                 '"/>',
//                 '<text x="50%" y="20%" text-anchor="middle" font-size="16" fill="white">',
//                 pet.name,
//                 "</text>",
//                 '<text x="50%" y="30%" text-anchor="middle" font-size="14" fill="white">',
//                 personalityToString(pet.personality),
//                 "</text>",
//                 '<text x="50%" y="40%" text-anchor="middle" font-size="20" fill="white">',
//                 mood,
//                 "</text>",
//                 renderBar(pet.hunger, "Hunger", 180),
//                 renderBar(pet.happiness, "Happiness", 200),
//                 renderBar(pet.energy, "Energy", 220),
//                 renderBar(pet.cleanliness, "Cleanliness", 240),
//                 renderBar(pet.strength, "Strength", 260),
//                 "</svg>"
//             )
//         );
//         return svg;
//     }

//     function renderBar(
//         uint256 value,
//         string memory label,
//         uint256 y
//     ) internal pure returns (string memory) {
//         uint256 width = value;
//         return
//             string(
//                 abi.encodePacked(
//                     '<text x="10" y="',
//                     Strings.toString(y),
//                     '" font-size="10" fill="white">',
//                     label,
//                     "</text>",
//                     '<rect x="60" y="',
//                     Strings.toString(y - 8),
//                     '" width="100" height="10" fill="#555"/>',
//                     '<rect x="60" y="',
//                     Strings.toString(y - 8),
//                     '" width="',
//                     Strings.toString(width),
//                     '" height="10" fill="#0f0"/>'
//                 )
//             );
//     }

//     function tokenURI(address owner) public view returns (string memory) {
//         Pet storage pet = pets[owner];
//         string memory svg = renderSVG(owner);
//         string memory image = string(
//             abi.encodePacked(
//                 "data:image/svg+xml;base64,",
//                 Base64.encode(bytes(svg))
//             )
//         );
//         string memory json = string(
//             abi.encodePacked(
//                 '{"name":"',
//                 bytes(pet.name).length > 0 ? pet.name : "Unnamed Pet",
//                 '","description":"A fully onchain Tamagotchi.","image":"',
//                 image,
//                 '","attributes":[{"trait_type":"Stage","value":"',
//                 stageToString(pet.stage),
//                 '"},{"trait_type":"XP","value":"',
//                 Strings.toString(pet.xp),
//                 '"}]}'
//             )
//         );
//         return
//             string(
//                 abi.encodePacked(
//                     "data:application/json;base64,",
//                     Base64.encode(bytes(json))
//                 )
//             );
//     }

//     function stageToString(Stage stage) internal pure returns (string memory) {
//         if (stage == Stage.Baby) return "Baby";
//         if (stage == Stage.Teen) return "Teen";
//         if (stage == Stage.Adult) return "Adult";
//         if (stage == Stage.Elder) return "Elder";
//         if (stage == Stage.Sick) return "Sick";
//         return "Dead";
//     }

//     function personalityToString(
//         Personality p
//     ) internal pure returns (string memory) {
//         if (p == Personality.Shy) return "Shy";
//         if (p == Personality.Bold) return "Bold";
//         if (p == Personality.Lazy) return "Lazy";
//         if (p == Personality.Cheerful) return "Cheerful";
//         return "Grumpy";
//     }

//     function getBackground(Stage stage) internal pure returns (string memory) {
//         if (stage == Stage.Baby) return "#FFF8DC";
//         if (stage == Stage.Teen) return "#E0FFFF";
//         if (stage == Stage.Adult) return "#FFD700";
//         if (stage == Stage.Elder) return "#8A2BE2";
//         if (stage == Stage.Sick) return "#8B0000";
//         return "#2F4F4F";
//     }

//     function getMood(
//         Stage stage,
//         uint256 happiness
//     ) internal pure returns (string memory) {
//         if (stage == Stage.Dead) return "X_X";
//         if (stage == Stage.Sick) return "-_-";
//         if (happiness > 70) return "^_^";
//         if (happiness > 30) return "-.-";
//         return "T_T";
//     }

//     function checkEvolution(address owner) internal {
//         Pet storage pet = pets[owner];
//         if (pet.stage == Stage.Baby && pet.xp >= 100) {
//             pet.stage = Stage.Teen;
//             emit PetEvolved(owner, pet.stage);
//         } else if (pet.stage == Stage.Teen && pet.xp >= 300) {
//             pet.stage = Stage.Adult;
//             emit PetEvolved(owner, pet.stage);
//         } else if (pet.stage == Stage.Adult && pet.xp >= 800) {
//             pet.stage = Stage.Elder;
//             pet.achievements.reachedElder = true;
//             emit PetEvolved(owner, pet.stage);
//         }
//     }

//     function calculateMiniGameScore(
//         Pet storage pet,
//         MiniGame game
//     ) internal view returns (uint256) {
//         if (game == MiniGame.TugOfWar)
//             return pet.strength * (pet.energy > 50 ? 2 : 1);
//         if (game == MiniGame.HideAndSeek)
//             return pet.happiness * (pet.cleanliness > 70 ? 2 : 1);
//         if (game == MiniGame.Trivia) return pet.xp / 10 + pet.energy;
//         return pet.happiness + pet.strength / 2;
//     }

//     function ownsItem(
//         address owner,
//         uint256 itemId
//     ) internal view returns (bool) {
//         for (uint256 i = 0; i < ownedItemIds[owner].length; i++) {
//             if (ownedItemIds[owner][i] == itemId) return true;
//         }
//         return false;
//     }

//     function min(uint256 a, uint256 b) internal pure returns (uint256) {
//         return a < b ? a : b;
//     }
// }

// library Base64 {
//     bytes internal constant TABLE =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

//     function encode(bytes memory data) internal pure returns (string memory) {
//         uint256 len = data.length;
//         if (len == 0) return "";
//         uint256 encodedLen = 4 * ((len + 2) / 3);
//         string memory result = new string(encodedLen + 32);
//         bytes memory table = TABLE;

//         assembly ("memory-safe") {
//             let tablePtr := add(table, 1)
//             let resultPtr := add(result, 32)
//             for {
//                 let i := 0
//             } lt(i, len) {

//             } {
//                 i := add(i, 3)
//                 let input := and(mload(add(data, i)), 0xffffff)
//                 let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
//                 out := shl(8, out)
//                 out := add(out, mload(add(tablePtr, and(shr(12, input), 0x3F))))
//                 out := shl(8, out)
//                 out := add(out, mload(add(tablePtr, and(shr(6, input), 0x3F))))
//                 out := shl(8, out)
//                 out := add(out, mload(add(tablePtr, and(input, 0x3F))))
//                 out := shl(224, out)
//                 mstore(resultPtr, out)
//                 resultPtr := add(resultPtr, 4)
//             }
//             switch mod(len, 3)
//             case 1 {
//                 mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
//             }
//             case 2 {
//                 mstore(sub(resultPtr, 1), shl(248, 0x3d))
//             }
//             mstore(result, encodedLen)
//         }

//         return result;
//     }
// }
