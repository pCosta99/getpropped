// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PropsCoin is ERC20 {
    constructor() ERC20("PropsCoin", "PRP") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @dev You either get a props or you don't!
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function wasPropped() public view returns (bool) {
        return balanceOf(msg.sender) != 0;
    }

    function getPropped() public {
        require(!wasPropped(), "No twice propping!");
        _mint(msg.sender, 1);
    }
}
