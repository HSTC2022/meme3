// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Meme3Manager is Ownable{

    mapping(address => bool) public listBannedUser;

    constructor(){}

    function banUser(address userAdr) public onlyOwner{
        listBannedUser[userAdr] = false;
    }

    function unbanUser(address userAdr) public onlyOwner {
        listBannedUser[userAdr] = true;
    }

    function getUserStatus(address userAdd) public view returns(bool){
        return listBannedUser[userAdd];
    }

    function unpublishPost(uint256 postId) public onlyOwner {
        
    }

}