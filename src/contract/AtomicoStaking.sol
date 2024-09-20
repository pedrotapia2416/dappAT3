// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Atomico3Staking is Ownable {
    IERC20 public atomico3Token;

    struct Stake {
        uint256 amount;
        uint256 stakingDays;
        uint256 startTime;
        uint256 reward;
        string name;
        string email;
        string document;
        bool active;
    }

    mapping(address => Stake[]) public stakes;
    address[] public stakers;

    constructor(address _atomico3Token, address _ownerAddress) Ownable(_ownerAddress) {
        atomico3Token = IERC20(_atomico3Token);
    }

    function stake(
        uint256 _amount,
        uint256 _stakingDays,
        string memory _name,
        string memory _email,
        string memory _document
    ) external {
        require(_amount > 0, "Amount must be greater than 0");

        atomico3Token.transferFrom(msg.sender, address(this), _amount);

        uint256 reward = calculateReward(_amount, _stakingDays);

        stakes[msg.sender].push(
            Stake({
                amount: _amount,
                stakingDays: _stakingDays,
                startTime: block.timestamp,
                reward: reward,
                name: _name,
                email: _email,
                document: _document,
                active: true
            })
        );

        // Agregar al staker si no está ya en la lista
        if (stakes[msg.sender].length == 1) {
            stakers.push(msg.sender);
        }
    }

    function calculateReward(uint256 _amount, uint256 _stakingDays) internal pure returns (uint256) {
        if (_stakingDays == 60) {
            return (_amount * 19) / 100;
        } else if (_stakingDays == 180) {
            return (_amount * 14) / 100;
        } else if (_stakingDays == 240) {
            return (_amount * 10) / 100;
        } else {
            return 0;
        }
    }

    function unstake(uint256 _stakeIndex) external {
        Stake storage userStake = stakes[msg.sender][_stakeIndex];
        require(userStake.active, "Stake is already withdrawn");
        require(
            block.timestamp >= userStake.startTime + userStake.stakingDays * 1 days,
            "Staking period not yet finished"
        );

        uint256 totalAmount = userStake.amount + userStake.reward;
        userStake.active = false;

        atomico3Token.transfer(msg.sender, totalAmount);
    }

    function getUserStakes(address _user) external view returns (Stake[] memory) {
        return stakes[_user];
    }

    function getAllStakes() external view onlyOwner returns (Stake[] memory) {
        uint256 totalStakes = 0;

        for (uint256 i = 0; i < stakers.length; i++) {
            totalStakes += stakes[stakers[i]].length;
        }

        Stake[] memory allStakes = new Stake[](totalStakes);
        uint256 index = 0;

        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            for (uint256 j = 0; j < stakes[staker].length; j++) {
                allStakes[index] = stakes[staker][j];
                index++;
            }
        }

        return allStakes;
    }

    function getStakers() external view onlyOwner returns (address[] memory) {
        return stakers;
    }
}