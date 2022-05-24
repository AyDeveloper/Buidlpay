// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.0;
import './buidlpayToken.sol';

contract BuidlPay is BuidlPayToken {
    // builder struct
    struct Buidler {
        address addr;
        bool active;
        uint8 projects;
        uint voteCount;
    }

      constructor (string memory name_, string memory symbol_, uint8 decimals_) BuidlPayToken(name_,symbol_,decimals_)  {
    }

    error AmountLessThanZero(); 
    error VoteLessThanTwo();

    event VoteCount(uint _voteCount);
    event RewardBuilder(address _builder, uint _token);

    mapping(address => Buidler) addrToBuilder;
    // mapping(address => bool) voted;

    function Register() public {
        Buidler storage builder = addrToBuilder[msg.sender];
        if(builder.active == true) builder.projects++;
        builder.addr = msg.sender;
        builder.active = true;
    }

    function RewardBuidler(address _builderAddr) payable public {
        Buidler storage builder = addrToBuilder[_builderAddr];
        if(msg.value <= 0) revert AmountLessThanZero();
        if(builder.voteCount < 2) revert VoteLessThanTwo();
        require(msg.sender != _builderAddr, "BuidlPay: Active Buidler cannot reward his project");
        (bool success, ) = _builderAddr.call{value: msg.value}("");
        require(success, "BuidlPay: Failed to send Klay");
        _mint(_builderAddr, 2 * 10 ** 18); 

        emit RewardBuilder(_builderAddr, 50);
    }


    function Vote(address _builderAddr) public {
        Buidler storage builder = addrToBuilder[_builderAddr];
        // require(!voted[msg.sender], "BuildPay: Cannot vote twice");
        require(msg.sender != _builderAddr, "BuidlPay: Active Buidler cannot vote his project");
        require(builder.active, "BuidlPay: Not an active Buidler");
        // voted[msg.sender] = true;
        builder.voteCount++;
        emit VoteCount(builder.voteCount);
    }

    function validityForGrant() public view returns(bool) {
        require(balanceOf(msg.sender) >= 50, "BuildPay: You need BuidlPay token to qualify!!");
        return true;
    }

    function getBuidler(address _builderAddr) public view returns(uint) {
        return addrToBuilder[_builderAddr].voteCount;
    }



}
