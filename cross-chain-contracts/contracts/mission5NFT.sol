// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

interface ILockable {
    function lock(uint256 tokenId, address manager, uint256 duration) external;

    function unlock(uint256 tokenId) external;

    function isLocked(uint256 tokenId) external view returns (bool);
}

contract Mission5NFT is ERC721Enumerable, Ownable, ILockable, ERC2981 {
    using Strings for uint256;

    struct LockInfo {
        bool active;
        address manager; // Address that manages the lock
        uint256 lockTimestamp;
        uint256 duration;
    }

    mapping(uint256 => LockInfo) private locks;
    uint256 public nextTokenId;
    uint256 public constant MAX_SUPPLY = 1111;

    event Locked(uint256 indexed tokenId, uint256 duration);
    event Unlocked(uint256 indexed tokenId);

    constructor() ERC721("Monad Monanimals", "MONANIMAL") Ownable() {
        // Set default royalty to 10% to contract owner
        _setDefaultRoyalty(msg.sender, 1000); // 1000 = 10% (in basis points)
    }

    function mint(address to) public returns (uint256) {
        require(nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(to != address(0), "Invalid address");
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        nextTokenId++;
        return tokenId;
    }

    function lock(
        uint256 tokenId,
        address manager,
        uint256 duration
    ) external override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Not owner nor approved"
        );
        require(!locks[tokenId].active, "Already locked");
        require(duration > 0, "Duration must be > 0");

        require(manager != address(0), "Invalid manager address");
        locks[tokenId] = LockInfo({
            active: true,
            manager: manager,
            lockTimestamp: block.timestamp,
            duration: duration
        });
        emit Locked(tokenId, duration);
    }

    function unlock(uint256 tokenId) external override {
        require(locks[tokenId].active, "Not locked");
        require(msg.sender == locks[tokenId].manager, "Not authorized manager");
        // Only allow unlock if lock period is over or manager is unlocking
        if (
            block.timestamp <
            locks[tokenId].lockTimestamp + locks[tokenId].duration
        ) {
            // If still locked, only manager can unlock
            require(
                msg.sender == locks[tokenId].manager,
                "Only lock manager can unlock during lock period"
            );
        }
        locks[tokenId].active = false;
        locks[tokenId].lockTimestamp = 0;
        locks[tokenId].duration = 0;
        locks[tokenId].manager = address(0);
        emit Unlocked(tokenId);
    }

    function isLocked(uint256 tokenId) public view override returns (bool) {
        return locks[tokenId].active;
    }

    // Block transfers/approvals when locked
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(!isLocked(tokenId), "NFT is locked");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function approve(
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        require(!isLocked(tokenId), "NFT is locked");
        super.approve(to, tokenId);
    }

    function setApprovalForAll(
        address operator,
        bool approved
    ) public override(ERC721, IERC721) {
        super.setApprovalForAll(operator, approved);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Dynamic SVG metadata with monanimals theme
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        bool locked = isLocked(tokenId);
        string memory status = locked ? "Locked" : "Unlocked";
        string memory color = locked ? "#6c47ff" : "#00e1c0";
        string memory face = locked ? unicode"😼" : unicode"😺";
        string memory padlock = locked ? unicode"🔒" : unicode"🔓";
        string memory manager = locks[tokenId].active
            ? _shortenAddress(locks[tokenId].manager)
            : "None";

        // Use full hex address for JSON attributes to avoid parsing issues
        string memory cManager = (locks[tokenId].active &&
            locks[tokenId].manager != address(0))
            ? Strings.toHexString(uint256(uint160(locks[tokenId].manager)), 20)
            : "None";

        string memory description = locked
            ? "This NFT is currently locked and managed by a lock manager. Unlock to access its full capabilities."
            : "This NFT is unlocked and fully accessible!";
        string
            memory about = "Monad Monanimals are dynamic, lockable NFTs with Monad lore (monanimals theme). They support on-chain locking, dynamic SVG, and royalty. Created for Mission 5. Social: x.com/bossonormal1, t.me/adonormal";

        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="350" height="350">',
                '<rect width="100%" height="100%" fill="',
                color,
                '"/>',
                // Padlock icon at the top
                '<text x="50%" y="20%" dominant-baseline="middle" text-anchor="middle" font-size="40">',
                padlock,
                "</text>",
                // Face
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="80">',
                face,
                "</text>",
                // Status
                '<text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="#fff">',
                status,
                " #",
                tokenId.toString(),
                "</text>",
                // Manager address (shortened)
                '<text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#fff">Manager: ',
                cManager,
                "</text>",
                "</svg>"
            )
        );

        // Attributes array - use full hex address for JSON compatibility
        string memory attributes = string(
            abi.encodePacked(
                "[",
                '{"trait_type":"Status","value":"',
                status,
                '"},',
                '{"trait_type":"Manager","value":"',
                cManager,
                '"},',
                '{"trait_type":"Token ID","value":"',
                tokenId.toString(),
                '"}',
                "]"
            )
        );

        // JSON metadata
        string memory json = string(
            abi.encodePacked(
                "{",
                '"name":"Monad Monanimal #',
                tokenId.toString(),
                '",',
                '"description":"',
                description,
                '",',
                '"about":"',
                about,
                '",',
                '"image":"data:image/svg+xml;base64,',
                _base64(bytes(svg)),
                '",',
                '"external_url":"https://x.com/bossonormal1",',
                '"attributes":',
                attributes,
                ",",
                '"socials": ["https://x.com/bossonormal1", "https://t.me/adonormal"]',
                "}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    _base64(bytes(json))
                )
            );
    }

    function _shortenAddress(
        address addr
    ) internal pure returns (string memory) {
        bytes20 value = bytes20(addr);
        bytes memory str = new bytes(13); // 0x + 4 + ... + 4
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 2; i++) {
            str[2 + i] = _char(
                (uint8(value[i >> 1]) >> (4 * (1 - (i % 2)))) & 0xf
            );
        }
        str[4] = ".";
        str[5] = ".";
        str[6] = ".";
        for (uint i = 0; i < 4; i++) {
            str[7 + i] = _char(
                (uint8(value[18 + (i >> 1)]) >> (4 * (1 - (i % 2)))) & 0xf
            );
        }
        return string(str);
    }

    function _char(uint8 b) private pure returns (bytes1 c) {
        if (b < 10) return bytes1(b + 0x30);
        else return bytes1(b + 0x57);
    }

    // Internal base64 encoding (OpenZeppelin style)
    function _base64(bytes memory data) internal pure returns (string memory) {
        string
            memory TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";
        uint256 encodedLen = 4 * ((len + 2) / 3);
        string memory result = new string(encodedLen + 32);
        assembly {
            let tablePtr := add(TABLE, 1)
            let resultPtr := add(result, 32)
            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)
                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(18, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(12, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(
                    resultPtr,
                    mload(add(tablePtr, and(shr(6, input), 0x3F)))
                )
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
            mstore(result, encodedLen)
        }
        return result;
    }
}
