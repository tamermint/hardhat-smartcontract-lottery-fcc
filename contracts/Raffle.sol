//Enter the raffle by paying some amount
//Pick a random winner (VRF)
//winner to be selected every x minutes - > automated

//chainlink oracle -> Randomness, Automated execution (chainlink keepers)

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/// @author Vivek Mitra
/// @title A raffle example
contract Raffle is VRFConsumerBaseV2 {
    error Raffle_notEnoughEthEntered();
    error Raffle_TransferFailed();

    /* STATE VARIABLES */
    uint256 private immutable i_entranceFee; //min base fee to enter raffle
    address payable[] private s_players; //this is for players entering the raffle
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; //making a coordinator object using the interface
    bytes32 private immutable i_gasLane; //price willing to pay for request to fulfill
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery Variable */
    address private s_recentWinner;

    /* EVENTS */ //For event, the function emitting the event, the event should be named in reverse of the function
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        //set the entrance fee
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2); //setting the address of the vrfcoordinator to vrfCoordinatorV2
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        //require msg.value >= i_entranceFee
        if (msg.value < i_entranceFee) {
            revert Raffle_notEnoughEthEntered(); //revert transaction if less than entrance fee
        }

        s_players.push(payable(msg.sender)); //push the player into this array i.e. the player who sends to this contract

        emit RaffleEnter(msg.sender);
    } //msg.sender is not payable by default so have to typecast to payable

    function requestRandomWinner() external {
        //request random number
        //then do something with it
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256,
        /* requestID */
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle_TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns (uint256) {
        //get the fee
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
