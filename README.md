# Hardhat Contract Mutator

An utility for mutation testing of Solidity contracts in [Hardhat](https://hardhat.org/) environment.

## Disclaimer

❗❗ The library is currently in alpha stage. It may be not ready for production use.

## Installation

`npm install @fluct-io/hardhat-contract-mutator --save-dev`

Requires [Hardhat](https://hardhat.org/tutorial) project setup.

## Basic Usage

Let's override MINT_PRICE constant for this contract:

```Solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Hyperreality is ERC721, PullPayment, Ownable {
  using Counters for Counters.Counter;

  // Constants
  uint256 public constant TOTAL_SUPPLY = 10_000;
  uint256 public constant MINT_PRICE = 0.09 ether;

  Counters.Counter private currentTokenId;

  /// @dev Base token URI used as a prefix by tokenURI().
  string public baseTokenURI;

  constructor() ERC721("Hyperreality", "HPR") {
    baseTokenURI = "";
  }

  function mintTo(address recipient) public payable returns (uint256) {
    uint256 tokenId = currentTokenId.current();
    require(tokenId < TOTAL_SUPPLY, "Max supply reached");
    require(msg.value == MINT_PRICE, "Transaction value did not equal the mint price");

    currentTokenId.increment();
    uint256 newItemId = currentTokenId.current();
    _safeMint(recipient, newItemId);
    return newItemId;
  }

  /// @dev Returns an URI for a given token ID
  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  /// @dev Sets the base token URI prefix.
  function setBaseTokenURI(string memory _baseTokenURI) public onlyOwner {
    baseTokenURI = _baseTokenURI;
  }

  /// @dev Overridden in order to make it an onlyOwner function
  function withdrawPayments(address payable payee) public override onlyOwner virtual {
      super.withdrawPayments(payee);
  }
}
```

We can write a test like that:

```JavaScript
it("Minting should require 0.1 ether", async function () {
    const [owner] = await ethers.getSigners();
    // Mutation
    const mutator = new ContractMutator(hre);
    const mutation = new ConstantMutation(hre, "Hyperreality");
    mutation.setConstant("MINT_PRICE", { value: "0.1" });
    const mutatedContract = await mutator.mutate(mutation);
    // End Mutation

    const contractFactory = await ethers.getContractFactory(
        mutatedContract.abi,
        mutatedContract.evm.bytecode
    );
    const contract = await contractFactory.deploy();

    await expect(
        contract.connect(owner).mintTo(owner.address, {
        value: ethers.utils.parseEther("0.09"),
        })
    ).to.be.revertedWith("Transaction value did not equal the mint price");
});
```

The mutated contract will be executed with **0.1 ether** MINT_PRICE value instead of original **0.09 ether**.
