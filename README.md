# Sudokoin

An easy to understand, proof of (little) work Ethereum token

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
