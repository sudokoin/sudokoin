var testResults = {};

function test(){

  // define test helpers
  var
    assert = function(exp, msg) { if (!exp) { console.log("!!! " + msg); } },
    bn = function(num) { return new BigNumber(num); },
    log = function(obj) { console.log(JSON.stringify(obj)); },
    sleep = function(blocks) { admin.sleepBlocks(blocks); },
    errors = [],
    events = [],
    password = "test_password",
    accountA = personal.newAccount(password),
    accountB = personal.newAccount(password),
    accountC = personal.newAccount(password),
    balanceA = bn(0),
    balanceB = bn(0),
    balanceC = bn(0),
    totalSupply = bn("203462379904501283815424"),
    tier1Reward = bn("576460752303423488"),
    amountTooLarge = totalSupply.add(1),
    providedGas = 300000,
    validBoard = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,9,1,2,
      6,7,8,9,1,2,3,4,5,
      9,1,2,3,4,5,6,7,8
    ],
    vbCompressed = bn("1234567845678912789123452345678956789123891234563456789167891234"),
    validBoard2 = [
      9,8,7,6,5,4,3,2,1,
      6,5,4,3,2,1,9,8,7,
      3,2,1,9,8,7,6,5,4,
      8,7,6,5,4,3,2,1,9,
      5,4,3,2,1,9,8,7,6,
      2,1,9,8,7,6,5,4,3,
      7,6,5,4,3,2,1,9,8,
      4,3,2,1,9,8,7,6,5,
      1,9,8,7,6,5,4,3,2
    ],
    vb2Compressed = bn("9876543265432198321987658765432154321987219876547654321943219876"),
    invalidBoard = [
      2,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,9,1,2,
      6,7,8,9,1,2,3,4,5,
      9,1,2,3,4,5,6,7,8
    ],
    invalidBoard2 = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,0,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,9,1,2,
      6,7,8,9,1,2,3,4,5,
      9,1,2,3,4,5,6,7,8
    ],
    invalidBoard3 = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,10,1,2,
      6,7,8,9,1,2,3,4,5,
      9,1,2,3,4,5,6,7,8
    ],
    invalidBoard4 = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,10,1,2,
      6,7,8,9,1,2,3,4,9,
      9,1,2,3,4,5,6,7,8
    ],
    invalidBoard5 = [
      1,2,3,4,5,6,7,8,9,
      4,5,6,7,8,9,1,2,3,
      7,8,9,1,2,3,4,5,6,
      2,3,4,5,6,7,8,9,1,
      5,6,7,8,9,1,2,3,4,
      8,9,1,2,3,4,5,6,7,
      3,4,5,6,7,8,9,1,2
    ];

  // define tests
  var instanceTests = function(instance) {

    /*

      board validation

    */
    console.log("testing board validation");
    assert(instance.validateBoard(validBoard), "does not validate valid board");
    assert(instance.validateBoard(validBoard2), "does not validate valid board 2");
    assert(!instance.validateBoard(invalidBoard), "validated invalid board");
    assert(!instance.validateBoard(invalidBoard2), "validated invalid board 2");
    assert(!instance.validateBoard(invalidBoard3), "validated invalid board 3");
    assert(!instance.validateBoard(invalidBoard4), "validated invalid board 4");
    assert(!instance.validateBoard(invalidBoard5), "validated invalid board 5");

    /*

      board compression

    */
    console.log("testing board compression");
    assert(vbCompressed.eq(instance.compressBoard(validBoard)), "failed compressing board");
    assert(vb2Compressed.eq(instance.compressBoard(validBoard2)), "failed compressing board 2");

    /*

      tier reward

    */
    console.log("testing tier reward");

    assert(instance.nextReward("11571").eq("576460752303423488"), "wrong tier 1 reward");
    assert(instance.nextReward("11572").eq("288230376151711744"), "wrong tier 2 reward");
    assert(instance.nextReward("185153").eq("36028797018963968"), "wrong tier 5 reward");
    assert(instance.nextReward("185154").eq("18014398509481984"), "wrong tier 6 reward");
    assert(instance.nextReward("6670903752021072936959").eq("1"), "wrong tier 60 reward");
    assert(instance.nextReward("6670903752021072936960").eq("0"), "wrong tier 61 reward");

    /*

      claiming boards

    */
    console.log("testing claiming boards");
    var
      txClaim = instance.claimBoard.sendTransaction(validBoard, {from: accountA, gas: providedGas}),
      txClaim2 = instance.claimBoard.sendTransaction(validBoard2, {from: accountA, gas: providedGas});

    balanceA = balanceA.add(tier1Reward).mul(2);

    sleep(2);

    // already claimed, so this should fail
    var
      txClaim3 = instance.claimBoard.sendTransaction(validBoard2, {from: accountB, gas: providedGas});

    sleep(2);

    var
      rcClaim = eth.getTransactionReceipt(txClaim),
      rcClaim2 = eth.getTransactionReceipt(txClaim2),
      rcClaim3 = eth.getTransactionReceipt(txClaim3);

    assert(rcClaim.blockNumber, "claim not processed");
    assert(rcClaim2.blockNumber, "claim 2 not processed");
    assert(rcClaim3.blockNumber, "claim 3 not processed");

    assert(instance.claimedBoards(vbCompressed), "board not claimed");
    assert(instance.claimedBoards(vb2Compressed), "second board not claimed");

    assert(rcClaim.gasUsed == 191939, "used gas changed to " + rcClaim.gasUsed);
    assert(rcClaim2.gasUsed == 161939, "used gas for second claim differs " + rcClaim2.gasUsed);
    assert(rcClaim3.gasUsed != 161939, "gas usage should differ from successful claim " + rcClaim3.gasUsed);

    assert(balanceA.eq(instance.balanceOf(accountA)), "tokens not rewarded");
    assert(balanceB.eq(instance.balanceOf(accountB)), "tokens rewarded wrongfully");

    assert(totalSupply.eq(instance.totalSupply()), "supply should not change");
    assert(instance.boards() == 2, "board count should change");

    /*

      transferring tokens

    */
    console.log("testing transferring tokens");
    var
      txTransfer = instance.transfer.sendTransaction(accountB, 22, {from: accountA, gas: providedGas}),
      txTransfer2 = instance.transfer.sendTransaction(accountB, 10, {from: accountC, gas: providedGas})
      txTransfer3 = instance.transfer.sendTransaction(accountB, amountTooLarge, {from: accountA, gas: providedGas});

    balanceA = balanceA.sub(22);
    balanceB = balanceB.add(22);

    sleep(2);

    var
      rcTransfer = eth.getTransactionReceipt(txTransfer),
      rcTransfer2 = eth.getTransactionReceipt(txTransfer2),
      rcTransfer3 = eth.getTransactionReceipt(txTransfer3);

    assert(balanceA.eq(instance.balanceOf(accountA)), "tokens not tranferred");
    assert(balanceB.eq(instance.balanceOf(accountB)), "tokens transferred wrongfully");

    assert(rcTransfer.gasUsed != providedGas, "legal transfer should not burn all gas");
    assert(rcTransfer2.gasUsed == providedGas, "illegal transfer should burn all gas");
    assert(rcTransfer3.gasUsed == providedGas, "other illegal transfer should burn all gas");

    assert(totalSupply.eq(instance.totalSupply()), "supply should still not change");

    /*

      burning tokens

    */
    console.log("testing burning tokens");

    var
      txBurn = instance.burn.sendTransaction(40, {from: accountA, gas: providedGas}),
      txBurn2 = instance.burn.sendTransaction(40, {from: accountB, gas: providedGas}),
      txBurn3 = instance.burn.sendTransaction(amountTooLarge, {from: accountB, gas: providedGas});

    balanceA = balanceA.sub(40);

    sleep(2);

    var
      rcBurn = eth.getTransactionReceipt(txBurn),
      rcBurn2 = eth.getTransactionReceipt(txBurn2),
      rcBurn3 = eth.getTransactionReceipt(txBurn3);

    assert(balanceA.eq(instance.balanceOf(accountA)), "tokens not burned");
    assert(balanceB.eq(instance.balanceOf(accountB)), "tokens burned wrongfully");

    assert(rcBurn.gasUsed != providedGas, "legal burn should not burn all gas");
    assert(rcBurn2.gasUsed == providedGas, "illegal burn should burn all gas");
    assert(rcBurn3.gasUsed == providedGas, "other illegal burn should burn all gas");

    assert(totalSupply.sub(40).eq(instance.totalSupply()), "supply should change");

    /*

      setting allowance

    */
    console.log("testing setting allowance");

    var
      txApprove = instance.approve.sendTransaction(accountB, 30, {from: accountA, gas: providedGas});

    sleep(2);

    var
      allowance = instance.allowance(accountA, accountB);

    assert(bn("30").eq(allowance), "allowance was wrongfully set to " + allowance);

    /*

      transferring via allowance

    */
    console.log("testing transferring via allowance");

    var
      txTransferFrom = instance.transferFrom.sendTransaction(accountA, accountC, 11, {from: accountB, gas: providedGas}),
      txTransferFrom2 = instance.transferFrom.sendTransaction(accountB, accountC, 12, {from: accountA, gas: providedGas}),
      txTransferFrom3 = instance.transferFrom.sendTransaction(accountA, accountC, 31, {from: accountB, gas: providedGas});

    balanceA = balanceA.sub(11);
    balanceC = balanceC.add(11);

    sleep(2);

    var
      rcTransferFrom = eth.getTransactionReceipt(txTransferFrom),
      rcTransferFrom2 = eth.getTransactionReceipt(txTransferFrom2),
      rcTransferFrom3 = eth.getTransactionReceipt(txTransferFrom3);

    assert(rcTransferFrom.gasUsed != providedGas, "legal allowance transfer should not burn all gas");
    assert(rcTransferFrom2.gasUsed == providedGas, "illegal allowance transfer should burn all gas");
    assert(rcTransferFrom3.gasUsed == providedGas, "other illegal allowance transfer should burn all gas");

    assert(balanceA.eq(instance.balanceOf(accountA)), "tokens not transferred via allowance");
    assert(balanceB.eq(instance.balanceOf(accountB)), "tokens transferred wrongfully via allowance");
    assert(balanceC.eq(instance.balanceOf(accountC)), "tokens transferred wrongfully via allowance again");

    var
      allowanceUpdated = instance.allowance(accountA, accountB);

    assert(bn("19").eq(allowanceUpdated), "allowance has not been updated");

    /*

      burning via allowance

    */
    console.log("testing burning via allowance");

    var
      txBurnFrom = instance.burnFrom.sendTransaction(accountA, 9, {from: accountB, gas: providedGas}),
      txBurnFrom2 = instance.burnFrom.sendTransaction(accountB, 8, {from: accountA, gas: providedGas}),
      txBurnFrom3 = instance.burnFrom.sendTransaction(accountA, 900, {from: accountB, gas: providedGas});

    balanceA = balanceA.sub(9);

    sleep(2);

    var
      rcBurnFrom = eth.getTransactionReceipt(txBurnFrom),
      rcBurnFrom2 = eth.getTransactionReceipt(txBurnFrom2),
      rcBurnFrom3 = eth.getTransactionReceipt(txBurnFrom3);

    assert(balanceA.eq(instance.balanceOf(accountA)), "tokens not burned via allowance");
    assert(balanceB.eq(instance.balanceOf(accountB)), "tokens burned wrongfully via allowance");
    assert(balanceC.eq(instance.balanceOf(accountC)), "tokens burned wrongfully via allowance again");

    assert(rcBurnFrom.gasUsed != providedGas, "legal allowance burn should not burn all gas");
    assert(rcBurnFrom2.gasUsed == providedGas, "illegal allowance burn should burn all gas");
    assert(rcBurnFrom3.gasUsed == providedGas, "other illegal allowance burn should burn all gas");

    var
      allowanceUpdated = instance.allowance(accountA, accountB);

    assert(bn("10").eq(allowanceUpdated), "allowance has not been updated");

    assert(totalSupply.sub(49).eq(instance.totalSupply()), "supply should change again");
  }

  var abiTests = function(abi) {

    /*

      ERC20 compliance

    */
    console.log("testing ERC20 compliance");
    loadScript("ERC20_spec.js");
    abiStrings = [];
    for(var i=0; i < abi.length; i++) {
      abiStrings.push(JSON.stringify(abi[i]));
    }

    for(var i=0; i < erc20.length; i++) {
      var ERC20str = JSON.stringify(erc20[i]);
      var found = false;
      for(var j=0; j < abiStrings.length; j++) {
        if(ERC20str === abiStrings[j]) {
          found = true;
          break;
        }
      }
      assert(found, "ERC20 member missing: " + ERC20str);
    }
  }

  // initialize
  personal.unlockAccount(eth.accounts[0], password);
  personal.unlockAccount(accountA, password);
  personal.unlockAccount(accountB, password);
  personal.unlockAccount(accountC, password);
  eth.sendTransaction({from:eth.accounts[0], to:accountA, value: web3.toWei(1, "ether")});
  eth.sendTransaction({from:eth.accounts[0], to:accountB, value: web3.toWei(1, "ether")});
  eth.sendTransaction({from:eth.accounts[0], to:accountC, value: web3.toWei(1, "ether")});

  console.log("account A initialized: " + accountA);
  console.log("account B initialized: " + accountB);
  console.log("account C initialized: " + accountC);

  loadScript("sudokoin.js");
  var sdkABI = JSON.parse(sdkCompiled.contracts["sudokoin.sol:Sudokoin"].abi);
  var sdkContract = eth.contract(sdkABI);
  var sdkInstance = sdkContract.new({ from: eth.accounts[0], data: "0x" + sdkCompiled.contracts["sudokoin.sol:Sudokoin"].bin, gas: 4700000},
    function (e, contract) {
      if (typeof contract.address !== 'undefined') {
        // watch events
        testResults["watcher"] = sdkInstance.allEvents(
          function(err, ev) {
            if(err){
              errors.push(err);
              return;
            }
            events.push(ev);
          }
        );
        console.log('testing started');
        testResults["errors"] = errors;
        testResults["events"] = events;
        testResults["abi"] = sdkABI;
        testResults["instance"] = sdkInstance;
        abiTests(sdkABI);
        instanceTests(sdkInstance);
        console.log('testing done');
      }
    }
  );
}

try {
  test();
} catch(e) {
  console.log(e);
}
