# Sudokoin

An easy to understand, proof of (little) work Ethereum token

## BETA

Sudokoin is running at `0x3a0caa94b2c41c54b518979888162acc90d5ab47`. You can use it at your own peril right now. It should be fully ERC20 compliant.

Please feel free to create issues or contact us at [github@sudokoin.com](mailto:github@sudokoin.com)

As soon as we feel confident enough, we will configure `sudokoin.eth` to route to it.

## About

The idea behind Sudokoin is simple: claim a solved sudoku board and get 81 Sudokoin.

Every board can be claimed only once, hence supply is limited to 6670903752021072936960 * 81 tokens.

Sudokoin is implemented as an Ethereum contract and programmed using Solidity.

The creators need to acquire Sudokoin by the same means as everybody else: claiming solved sudokus.

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
