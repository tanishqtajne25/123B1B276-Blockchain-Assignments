// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    error Unauthorized();
    error EmptyName();
    error InvalidPrice();
    error IncorrectPayment(uint256 expected, uint256 received);
    error WithdrawFailed();

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address seller;
    }

    address public immutable owner;
    uint256 public productCount;

    mapping(uint256 => Product) private products;

    event ProductAdded(uint256 indexed id, string name, uint256 price, address indexed seller);
    event Withdrawn(address indexed by, uint256 amount);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProduct(string calldata name, uint256 price) external payable returns (uint256 id) {
        if (bytes(name).length == 0) revert EmptyName();
        if (price == 0) revert InvalidPrice();
        if (msg.value != price) revert IncorrectPayment(price, msg.value);

        id = ++productCount;
        products[id] = Product({
            id: id,
            name: name,
            price: price,
            seller: msg.sender
        });

        emit ProductAdded(id, name, price, msg.sender);
    }

    function getProduct(uint256 id) external view returns (Product memory) {
        return products[id];
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool ok, ) = payable(owner).call{value: amount}("");
        if (!ok) revert WithdrawFailed();

        emit Withdrawn(msg.sender, amount);
    }
}