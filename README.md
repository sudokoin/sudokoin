# Sudokoin

## About

Sudokoin is an easy to understand, proof of (little) work Ethereum token.

The simple idea behind it is: claim a solved sudoku board and get Sudokoin.

Every board can be claimed only once. Sudokoin are rewarded in 60 tiers. The amount of Sudokoin received per claimed sudoku is halved every tier, ending with 1 Sudokoin per sudoku in the last tier.

Sudokoin is implemented as an [ERC20][1] compliant Ethereum contract and programmed using Solidity.

The creators need to acquire Sudokoin by the same means as everybody else: claiming solved sudokus.

Please feel free to create issues or contact us at [github@sudokoin.com](mailto:github@sudokoin.com)

## ALPHA

An instance of Sudokoin is running at `0x21aec0a028d7adec228595b24439c7eb969edd5f`. You can use it at your own peril right now. It should be fully ERC20 compliant.

As soon as we feel confident enough, we will configure `sudokoin.eth` to route to it.

### Interacting with the contract

If you just want some stats, take a look at [Etherscan][2].

The simplest way to interact with the Sudokoin contract we know so far is by using Google Chrome, Metamask and Remix:

1. Install the [Metamask][5] Chrome extension (Firefox support is planned).
2. Open [Remix][3].
3. Click on the black and white plus icon in the top left.
4. Copy the contents of [sudokoin.sol][4] from this project into the empty editor.
5. Click `At Address` (green button at the right).
6. Provide this address: `0x21aec0a028d7adec228595b24439c7eb969edd5f`.

Every blue button that should now appear is a read-only method of the contract. Try for example clicking on `boards` and providing the resulting value to `nextReward`!

The red buttons are for transactions that need to be paid for with Ethereum. For this, you need to set up Metamask with an Ethereum account containing some Ether.

Please be aware that Sudokoin is still immature and undergoing continuous testing. If any severe bugs are found, a new version of the contract might be uploaded and old claimed boards might be lost.

If Metamask is set up and you have a board in the form of `[1,2,3,… ,7,8,9]`, you can try claiming it:

(At the time of this writing, claiming a board cost around [$0.68 / 161939 Gas][6].)

1. Check if board is correct via `validateBoard`.
2. Compress board via `compressBoard`.
3. Provide the compressed result to `claimedBoards` in double quotes.
4. If the result is false, provide the original array to `claimBoard` and confirm the transaction.

There is also a `TOKENS` tab in Metamask where you can add your Sudokoin balance.

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
[2]: https://etherscan.io/token/0x21aec0a028d7adec228595b24439c7eb969edd5f
[3]: https://ethereum.github.io/browser-solidity
[4]: https://raw.githubusercontent.com/sudokoin/sudokoin/69903bdf12d4e04f0b371773f66d627923912db9/sudokoin.sol
[5]: https://metamask.io/
[6]: https://etherscan.io/tx/0xa7bd4baf28d1e9ea508b7f3497835ea588f1c4bf6066f651c92cbcd29e82d009
