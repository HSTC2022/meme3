// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Meme3Token is ERC20, Ownable {
    using SafeERC20 for ERC20;
    uint256 initSupply = 8000000000 * 10**18;

    constructor() ERC20("PiToken", "PI"){
        _mint(msg.sender, initSupply);
    }

    // births per woman
    function mint(uint256 numBabyBorn) public onlyOwner{
        _mint(msg.sender, numBabyBorn);
    }

    // reduce py people dead per day
    function burn(uint256 numHumanDead) public onlyOwner{
        _burn(msg.sender, numHumanDead);
    }

}