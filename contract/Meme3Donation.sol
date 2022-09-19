// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Meme3NFT.sol";
import "./Meme3Token.sol";

contract Meme3Donation is Ownable{
    using SafeERC20 for IERC20;

    Meme3NFT tokenNFT;
    IERC20 private meme3Token;

    // postId => Total donated amount
    mapping (uint256 => uint256) public _postTotalDonate;

    // address => (postId => amount donated)
    mapping (address => mapping(uint256 => uint256)) public _userPostDonated;

    // postId => (user => amount)
    mapping (uint256 => mapping(address => uint256)) public _postUserDonated;

    event DonateForCreator(address indexed donator, address indexed creator, uint256 postId, uint256 amount);

    constructor(Meme3NFT _tokenNFT, IERC20 _meme3Token){
        // init nftContract
        tokenNFT = _tokenNFT;
        meme3Token = _meme3Token;
    }

    function donateForCreator(uint256 postId, uint256 amount) external{
        address creator = tokenNFT.ownerOf(postId);
        require(creator != address(0), "You cant donate for deleted post");
        require(amount > 0, "You must donate more than 0");
        meme3Token.safeTransferFrom(msg.sender, creator, amount);
        _postTotalDonate[postId] += amount;
        _userPostDonated[msg.sender][postId] += amount;
        _postUserDonated[postId][msg.sender] += amount;
        emit DonateForCreator(msg.sender, creator, postId, amount);
    }

    function getAmountDonated(uint256 postId) external view returns(uint256){
        return _userPostDonated[msg.sender][postId];
    }
}