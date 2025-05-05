// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./interfaces/ILockable.sol";

// contract LockableNFTCollection is
//     ERC721,
//     ERC721Enumerable,
//     ERC721URIStorage,
//     Ownable,
//     ILockable
// {
//     struct LockInfo {
//         bool active;
//         address manager;
//         uint256 lockTimestamp;
//         uint256 duration;
//     }

//     mapping(uint256 => LockInfo) private locks;
//     uint256 public nextTokenId;
//     uint256 public constant MAX_SUPPLY = 5555;

//     // Metadata variables
//     string public _tokenURI;

//     event Locked(
//         uint256 indexed tokenId,
//         address indexed manager,
//         uint256 duration
//     );
//     event Unlocked(uint256 indexed tokenId);
//     event EmergencyUnlocked(uint256 indexed tokenId, address triggeredBy);
//     event UnlockedAndTransfered(
//         uint256 indexed tokenId,
//         address borrower,
//         address lender
//     );

//     // constructor() ERC721("Lockable TEST NFT", "TEST") {}

//     constructor(
//         string memory _name,
//         string memory _symbol,
//         string memory _TokenURI
//     ) ERC721(_name, _symbol) Ownable(msg.sender) {
//         _tokenURI = _TokenURI;
//     }

//     function mint(address to) external returns (uint256) {
//         require(nextTokenId < MAX_SUPPLY, "Max supply reached");
//         require(to != address(0), "Invalid address");
//         require(_msgSender() == to, "Only the recipient can mint the NFT");
//         uint256 tokenId = nextTokenId;
//         _safeMint(to, tokenId);
//         nextTokenId++;
//         return tokenId;
//     }

//     function _isApprovedOrOwner(
//         address spender,
//         uint256 tokenId
//     ) internal view returns (bool) {
//         address owner = ownerOf(tokenId);
//         return (spender == owner ||
//             getApproved(tokenId) == spender ||
//             isApprovedForAll(owner, spender));
//     }

//     function lock(
//         uint256 tokenId,
//         address manager,
//         uint256 durationInSeconds
//     ) external override {
//         require(durationInSeconds > 0, "Duration can't be eternity");
//         // require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
//         require(
//             _isApprovedOrOwner(msg.sender, tokenId),
//             "Not owner nor approved"
//         );

//         require(!locks[tokenId].active, "Already locked");
//         require(manager != address(0), "Invalid manager address");

//         locks[tokenId] = LockInfo({
//             active: true,
//             manager: manager,
//             lockTimestamp: block.timestamp,
//             duration: durationInSeconds
//         });

//         emit Locked(tokenId, manager, durationInSeconds);
//     }

//     function unlock(uint256 tokenId) external override {
//         LockInfo storage lockInfo = locks[tokenId];
//         require(lockInfo.active, "Not locked");
//         require(msg.sender == lockInfo.manager, "Not authorized manager");

//         lockInfo.active = false;
//         lockInfo.manager = address(0);
//         lockInfo.lockTimestamp = 0;
//         lockInfo.duration = 0;

//         emit Unlocked(tokenId);
//     }

//     modifier onlyManager(uint256 tokenId) {
//         require(locks[tokenId].manager == msg.sender, "Caller is not manager");
//         _;
//     }

//     function unlockAndTransfer(
//         address to,
//         uint256 tokenId
//     ) external onlyManager(tokenId) {
//         require(isLocked(tokenId), "NFT not locked");
//         require(msg.sender == locks[tokenId].manager, "Not authorized manager");
//         locks[tokenId].active = false;
//         locks[tokenId].manager = address(0);
//         locks[tokenId].lockTimestamp = 0;
//         locks[tokenId].duration = 0;

//         _transfer(ownerOf(tokenId), to, tokenId);
//         emit UnlockedAndTransfered(tokenId, ownerOf(tokenId), to);
//     }

//     function emergencyUnlock(uint256 tokenId) external override {
//         LockInfo storage lockInfo = locks[tokenId];
//         require(lockInfo.active, "Not locked");
//         require(
//             block.timestamp >= lockInfo.lockTimestamp + 365 days,
//             "Emergency unlock not allowed yet"
//         );

//         lockInfo.active = false;
//         lockInfo.manager = address(0);
//         lockInfo.lockTimestamp = 0;
//         lockInfo.duration = 0;

//         emit EmergencyUnlocked(tokenId, msg.sender);
//     }

//     function isLocked(uint256 tokenId) public view override returns (bool) {
//         return locks[tokenId].active;
//     }

//     function getLockInfo(
//         uint256 tokenId
//     )
//         external
//         view
//         override
//         returns (
//             bool locked,
//             address manager,
//             uint256 lockTimestamp,
//             uint256 duration
//         )
//     {
//         LockInfo storage info = locks[tokenId];
//         return (info.active, info.manager, info.lockTimestamp, info.duration);
//     }

//     function tokenURI(
//         uint256 tokenId
//     ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
//         return super.tokenURI(tokenId);
//     }

//     function approve(
//         address to,
//         uint256 tokenId
//     ) public override(ERC721, IERC721) {
//         require(!isLocked(tokenId), "NFT is locked");
//         super.approve(to, tokenId);
//     }

//     function setApprovalForAll(
//         address operator,
//         bool approved
//     ) public override(ERC721, IERC721) {
//         // Optional: Allow setApprovalForAll always, or block when locked if you want stricter security.
//         super.setApprovalForAll(operator, approved);
//     }

//     /** --- OPENZEPPELIN 5.0 FIXES HERE --- */

//     function _update(
//         address to,
//         uint256 tokenId,
//         address auth
//     ) internal override(ERC721, ERC721Enumerable) returns (address) {
//         // Protect against locked NFTs transfer
//         if (to != address(0)) {
//             // ignore minting
//             require(!isLocked(tokenId), "NFT is locked");
//         }
//         return super._update(to, tokenId, auth);
//     }

//     function _increaseBalance(
//         address account,
//         uint128 amount
//     ) internal override(ERC721, ERC721Enumerable) {
//         super._increaseBalance(account, amount);
//     }

//     function supportsInterface(
//         bytes4 interfaceId
//     )
//         public
//         view
//         override(ERC721, ERC721Enumerable, ERC721URIStorage, IERC165)
//         returns (bool)
//     {
//         return
//             interfaceId == type(ILockable).interfaceId ||
//             super.supportsInterface(interfaceId);
//     }

//     function totalSupply()
//         public
//         pure
//         override(ERC721Enumerable)
//         returns (uint256)
//     {
//         return MAX_SUPPLY;
//     }
// }
