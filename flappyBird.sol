// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FlappyBirdGame {

    struct Player {
        uint256 highScore;
        uint256 lastScore;
        uint256 lastPlayed;
    }

    mapping(address => Player) public players;

    uint256 public entryFee = 0.01 ether;

    event NewHighScore(address indexed player, uint256 newScore);
    event GamePlayed(address indexed player, uint256 score);

    // Ensure that the player is paying the correct entry fee
    modifier paysEntryFee() {
        require(msg.value == entryFee, "Incorrect entry fee");
        _;
    }

    function setGameFee(uint newFee) external onlyOwner {
        entryFee = newFee;
    }

    function loadFunds() external payable {
    }

    function playGame(uint256 score) external payable paysEntryFee() {
        // Check if the contract has enough balance to pay
        require(address(this).balance >= entryFee * 10, "Contract does not have enough funds");
        require(score >= 100);

        Player storage player = players[msg.sender];
        require(block.timestamp > player.lastPlayed + 1 minutes, "Please wait for 10 minutes");
        // Emit game played event
        emit GamePlayed(msg.sender, score);

        // If the player beats their high score
        if(score > player.highScore) {
            uint256 prize = entryFee * 2; // Double the entry fee

            // Check if the contract has enough balance to pay
            require(address(this).balance >= prize, "Contract does not have enough funds");

            // Update player's score
            player.highScore = score;

            // Transfer the prize to the player
            payable(msg.sender).transfer(prize);

            emit NewHighScore(msg.sender, score);
        }

        // Save the last played score and timestamp
        player.lastScore = score;
        player.lastPlayed = block.timestamp;
    }

    function getHighScore(address playerAddress) external view returns (uint256) {
        return players[playerAddress].highScore;
    }

    function getLastScore(address playerAddress) external view returns (uint256) {
        return players[playerAddress].lastScore;
    }

    // A function to allow the owner to withdraw the balance of the contract (Considered for any maintenance or operations purpose)
    address private owner = msg.sender;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
