// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EscrowDapp {
    struct Project {
        bool project_started;
        bool exist;
        string name;
        address payable project_owner;
        uint256 project_start_timestamp;
        uint256 project_end_timestamp;
    }

    struct Customer {
        uint256 rating;
    }

    bool is_wallet_blocked = false;
    address payable contract_owner;
    address payable escrow_address;
    uint256 public totalProjects = 0;
    uint256 one = 1;

    mapping(address => Customer) public customers;
    mapping(uint256 => Project) public projects;

    event LowRating(address _project_owner);

    constructor(address payable _escrow_address) public {
        escrow_address = _escrow_address;
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
        // projects[totalProjects].project_owner = msg.sender;
        projects[totalProjects]
            .project_start_timestamp = _project_start_timestamp;
        projects[totalProjects].project_end_timestamp = _project_end_timestamp;
        totalProjects++;
    }

    function startProject(uint256 project_id) public payable {
        require(projects[project_id].exist == true, "Unknown Project ID");
        require(projects[project_id].project_started == false, "Project already started");
        if (projects[project_id].project_start_timestamp > block.timestamp) {
            // deduct 1 per cent amount from the wallet
            escrow_address.transfer(address(msg.sender).balance * (one / 100));
        }
        projects[project_id].project_owner = msg.sender;
        projects[project_id].project_started = true;
        // release 10% if project starts
        msg.sender.transfer(address(escrow_address).balance * ((one * 10) / 100));
    }

    // function rateProject(uint256 _rating) public payable {
    //     require(_rating < 0 || _rating > 10, "Invalid rating");
    //     // unblock if blocked
    //     if (is_wallet_blocked) is_wallet_blocked = false;
    //     // add to customers
    //     customers[address(this)].rating = _rating;
    //     if (_rating == 7) {
    //         // warning issued to a private entity
    //         emit LowRating(project_owner);
    //     } else if (_rating == 6) {
    //         // 3 per cent deduction from the wallet
    //         project_owner.transfer(
    //             address(escrow_address).balance * ((one * 3) / 100)
    //         );
    //     } else if (_rating >= 5) {
    //         // wallet blocked
    //         is_wallet_blocked = true;
    //     }
    // }

    // function completedProject(address payable _owner) public payable {
    //     require(
    //         _owner == project_owner,
    //         "Only owner is allowed to complete the project"
    //     );
    //     if (project_end_timestamp < block.timestamp) {
    //         // charge a fee for using the project from customer.
    //     }
    // }
}
