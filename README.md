# Sudokoin

## About

Sudokoin is an easy to understand, proof of (little) work Ethereum token.

The simple idea behind it is: claim a solved sudoku board and get Sudokoin.

Every board can be claimed only once. Sudokoin are rewarded in 60 tiers. The amount of Sudokoin received per claimed sudoku is halved every tier, ending with 1 Sudokoin per sudoku in the last tier.

Sudokoin is implemented as an [ERC20][1] compliant Ethereum contract and programmed using Solidity.

The creators need to acquire Sudokoin by the same means as everybody else: claiming solved sudokus.

## BETA

An instance of Sudokoin is running at `0x21aec0a028d7adec228595b24439c7eb969edd5f`. You can use it at your own peril right now. It should be fully ERC20 compliant.

Please feel free to create issues or contact us at [github@sudokoin.com](mailto:github@sudokoin.com)

As soon as we feel confident enough, we will configure `sudokoin.eth` to route to it.

## Setup

### Compile contract

```bash
echo "var sdkCompiled=`solc --optimize --combined-json abi,bin,interface sudokoin.sol`" > sudokoin.js
```

### Run tests

```js
// within geth console
loadScript("sudokoin_test.js");
```

[1]: https://github.com/ethereum/EIPs/issues/20
