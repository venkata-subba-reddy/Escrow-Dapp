// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./SafeMath_library.sol";

contract EscrowDapp {
    using SafeMath for uint256;

    struct Customer {
        string review;
        uint256 rating;
    }
    struct Project {
        bool project_started;
        bool project_blocked;
        bool exist;
        string name;
        address payable project_owner;
        uint256 project_start_timestamp;
        uint256 project_end_timestamp;
        mapping(address => Customer) customers;
    }

    address payable contract_owner;
    uint256 public totalProjects = 0;
    uint256 private extras = 100;

    mapping(uint256 => Project) public projects;

    event LowRating(address _project_owner);

    constructor() public {
        contract_owner = msg.sender;
    }

    function createProject(
        string memory _name,
        uint256 _project_start_timestamp,
        uint256 _project_end_timestamp
    ) public {
        require(
            contract_owner == msg.sender,
            "Only owner is allowed to create the project."
        );
        projects[totalProjects].name = _name;
        projects[totalProjects].project_started = false;
        projects[totalProjects].exist = true;
        projects[totalProjects]
        .project_start_timestamp = _project_start_timestamp;
        projects[totalProjects].project_end_timestamp = _project_end_timestamp;
        totalProjects++;
    }

    // Fallback function to deposit the ethers to the contract
    fallback() external payable {}

    function contractBalance() public returns (uint256) {
        return address(this).balance;
    }

    // Calculates onePercent of the uint256 amount sent
    function onePercent(uint256 amount) internal view returns (uint256) {
        uint256 roundValue = amount.ceil(extras);
        uint256 onePercentofTokens = roundValue.mul(extras).div(
            extras * 10**uint256(2)
        );
        return onePercentofTokens;
    }

    function startProject(uint256 _project_id, uint256 _weiAmount)
        public
        payable
    {
        require(projects[_project_id].exist == true, "Unknown Project ID");
        require(
            projects[_project_id].project_started == false,
            "Project already started"
        );
        if (projects[_project_id].project_start_timestamp < block.timestamp) {
            // deduct 1 per cent amount from the wallet
            if (_weiAmount < (onePercent(address(this).balance) * 1)) {
                revert(
                    "Project time crossed. Add 1 percent of contract address"
                );
            }
            address(this).transfer(_weiAmount);
        }
        projects[_project_id].project_owner = msg.sender;
        projects[_project_id].project_started = true;
        // release 10% if project starts
        msg.sender.transfer(onePercent(address(this).balance) * 10);
    }

    function rateProject(uint256 _project_id, uint256 _rating, string memory _review) public payable {
        require(_rating > 0 && _rating < 10, "Invalid rating");
        require(
            projects[_project_id].project_started == true,
            "Project Not started"
        );
        require(
            projects[_project_id].project_owner != msg.sender,
            "Project owner cannot rate."
        );
        // unblock if blocked
        if (projects[_project_id].project_blocked)
            projects[_project_id].project_blocked = false;
        // add to customers
        projects[_project_id].customers[msg.sender].rating = _rating;
        projects[_project_id].customers[msg.sender].review = _review;
        if (_rating == 7) {
            // warning issued to a private entity
            emit LowRating(projects[_project_id].project_owner);
        } else if (_rating == 6) {
            // 3 per cent deduction from the wallet
            // TODO:
        } else if (_rating >= 5) {
            // wallet blocked
            projects[_project_id].project_blocked = true;
        }
    }

    function completedProject(uint256 _project_id) public {
        require(
            projects[_project_id].project_owner == msg.sender,
            "Only owner is allowed to complete the project"
        );
        require(
            projects[_project_id].project_blocked == false,
            "Project blocked cannot complete."
        );
        // if project finished on time
        if (projects[_project_id].project_end_timestamp < block.timestamp) {
            projects[_project_id].project_owner.transfer(
                onePercent(address(this).balance) * 70
            );
        }
    }

    function getRating(uint256 _project_id, address customer)
        public
        view
        returns (string memory, uint256)
    {
        return (
            projects[_project_id].customers[customer].review,
            projects[_project_id].customers[customer].rating
        );
    }
}
