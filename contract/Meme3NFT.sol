// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Meme3NFT is ERC721URIStorage, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string private nftCollectionName = "Meme3NFT";
    string private nftSymbol = "MEME3NFT";
    string private _baseMemeURI;
    address public controllerAddress;

    // mapping user => NFT_minted
    mapping(address => EnumerableSet.UintSet) private _creatorNFTs;

    // user => NFT_posted_in_app
    mapping(address => EnumerableSet.UintSet) private _pulisherPost;
    EnumerableSet.UintSet private _allPublishedPost;

    EnumerableSet.AddressSet private _admins;

    modifier onlyAdmin(address adminAdr){
        require(_admins.contains(adminAdr), "Only Admin can do this");
        _;
    }

    event CreateMeme(address creator, uint256 memeId);
    event DeleteMeme(address creator, uint256 memeId);

    constructor() ERC721(nftCollectionName, nftSymbol){}

    // Main function: Mint, Burn, setBaseUri
    function createMeme(string memory metadataURI) external {
        _tokenIds.increment();

        uint256 newMemeId = _tokenIds.current();
        _safeMint(msg.sender, newMemeId);
        _setTokenURI(newMemeId, metadataURI);

        require(_creatorNFTs[msg.sender].contains(newMemeId) == false, "Meme existed");
        _creatorNFTs[msg.sender].add(newMemeId);

        emit CreateMeme(msg.sender, newMemeId);
    }

    function deleteMeme(address nftOwner, uint256 memeId) public onlyOwner{
        require(nftOwner == ownerOf(memeId), "Only NftOwner can action");
        _burn(memeId);

        require(_creatorNFTs[msg.sender].contains(memeId) == true, "Meme does not exist");
        _creatorNFTs[msg.sender].remove(memeId);

        emit DeleteMeme(msg.sender, memeId);
    }

    function addPost(address pulisher, uint256 postId) external onlyAdmin(msg.sender) {
        require(pulisher == ownerOf(postId), "Only pulisher can post");
        require(_pulisherPost[pulisher].contains(postId) == false, "Post published");
        _pulisherPost[pulisher].add(postId);
        _allPublishedPost.add(postId);
    }

    function removePost(address pulisher, uint256 postId) external onlyAdmin(msg.sender) {
        require(pulisher == ownerOf(postId), "Only pulisher can remove");
        require(_pulisherPost[pulisher].contains(postId) == true, "Post was not published");
        _pulisherPost[pulisher].remove(postId);
        _allPublishedPost.remove(postId);
    }

    function isPostExist(uint256 postId) public view returns(bool){
        return(_allPublishedPost.contains(postId));
    }

    function getMemesOfOwner() public view returns(uint256[] memory){
        uint256 numNft = _creatorNFTs[msg.sender].length();
        uint256[] memory listNft = new uint256[](numNft);
        for (uint256 i=0; i<numNft; i=unsafe_inc(i)){
            listNft[i] = _creatorNFTs[msg.sender].at(i);
        }

        return listNft;
    }

    function getOwnerOfMeme(uint256 memeId) public view returns(address) {
        return ownerOf(memeId);
    }

    function getBalanceOfCreator(address creator) external view returns(uint256){
        return balanceOf(creator);
    }

    function addAdmin(address adminAdr) external onlyOwner {
        _admins.add(adminAdr);
    }

    function removeAdmin(address adminAdr) external onlyOwner {
        _admins.remove(adminAdr);
    }

    function getMemeURI(uint256 memeId) external view returns(string memory) {
        return tokenURI(memeId);
    }

    function setBaseUri(string memory baseURI) external onlyOwner{
        _baseMemeURI = baseURI;
    }

    function getBaseUri() external view returns(string memory){
        return _baseMemeURI;
    }

    function unsafe_inc(uint x) private pure returns (uint) {
        unchecked { return x + 1; }
    }
    
}
