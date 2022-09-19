// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Meme3User {
    constructor(){}

    mapping(address => string) private _addressUserName;
    mapping(address => string) private _addressUserAvatar;

    function getUserName() public view returns(string memory){
        return _addressUserName[msg.sender];
    }

    function setUserName(string memory uName) public{
        _addressUserName[msg.sender] = uName;
    }

    function getAvatar() public view returns(string memory){
        return _addressUserAvatar[msg.sender];
    }

    function setAvatar(string memory nftUri) public{
        _addressUserAvatar[msg.sender] = nftUri;
    }

    function getAvaxBalance() public view returns(uint256){
        return address(this).balance;
    }
}