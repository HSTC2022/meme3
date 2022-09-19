// SPDX-License-Identifier: MIT
pragma solidity >=0.8.12 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Meme3Token.sol";

contract Meme3Faucet is Ownable{
    using SafeERC20 for IERC20;

    IERC20 private meme3Token;

    // Event
    event ClaimFaucetToken(uint256 amountClaimed);

    // Variable
    // adr => timeClaimed
    mapping(address => uint256) public _userClaimedTime;
    uint256 public FAUCET_CLAIM_AMOUNT = 10*10**18;
    uint256 public FAUCET_CLAIM_COOLDOWN = 86400;

    // Constructor
    constructor(IERC20 _meme3Token){
        meme3Token = _meme3Token;
    }

    function claimToken() public {
        require(meme3Token.balanceOf(address(this)) >= FAUCET_CLAIM_AMOUNT, "Faucet has no more token. Try later.");
        require(_userClaimedTime[msg.sender] == 0 || block.timestamp - _userClaimedTime[msg.sender] >= FAUCET_CLAIM_COOLDOWN, "You claimed, please try later.");
        meme3Token.safeTransfer(msg.sender, FAUCET_CLAIM_AMOUNT);
        _userClaimedTime[msg.sender] = block.timestamp;
        emit ClaimFaucetToken(FAUCET_CLAIM_AMOUNT);
    }

    function setClaimAmount(uint256 claimAmount) public onlyOwner {
        require(claimAmount > 0, "Amount need more than 0");
        FAUCET_CLAIM_AMOUNT = claimAmount;
    }
}