// SPDX-License-Identifier: GPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract TestNFT is ERC721Enumerable, Ownable{
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    uint256 price = 0.01 ether;
    uint16 maxAmount = 1000;
    uint16 maxAmountPerCall = 20;
    

    constructor() ERC721("test NFT", "TNFT") Ownable() { }
    
    function changePrice(uint256 newPrice) 
        public onlyOwner {
        price = newPrice;
    }
    
    modifier _isEnoughTokens(uint16 amount){
        require(_tokenIds.current() + amount <= maxAmount, "More than possible amount");
        _;
    }
    
    modifier _isEnoughMoney(uint256 amount){
        require(price*amount == msg.value, "Incorrect value");
        _;
    }
    
    modifier _checkAmount(uint16 amount){
        require(amount <= maxAmountPerCall, "No bigger values than 20");
        require(amount >= 1, "Amount should be positive");
        _;
    }

    function buyToken() 
        external payable _isEnoughTokens(1) _isEnoughMoney(1) returns(bool success) {
        _safeMint(msg.sender, _tokenIds.current());
        _tokenIds.increment();
        return true;
    }
    
    function buyTokens(uint16 amount) 
        external payable _isEnoughTokens(amount) _checkAmount(amount) 
        _isEnoughMoney(amount) returns(bool success)  {
        address buyer = msg.sender;
        for (uint16 i = 0; i < amount; i++){
            _safeMint(buyer, _tokenIds.current());
            _tokenIds.increment();
        }
        return true;
    }
    
}