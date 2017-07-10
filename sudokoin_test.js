console.log("check testResults for further insights! (after testing is done)");
var testResults = {}

var testInstance = function(sdkInstance) {
  var testAccount = personal.newAccount("devPassword2");
  personal.unlockAccount(testAccount, "devPassword2");

  testResults["instance"] = sdkInstance;
  testResults["errors"] = [];
  testResults["events"] = [];

  testResults["watcher"] = sdkInstance.allEvents(
    function(err, ev) {
      if(err){
        testResults["errors"].push(err);
        return;
      }
      testResults["events"].push(ev);
    }
  );

  var totalSupply = bn("6670903752021072936960").mul(81);
  var maxGas = 300000;

  var validBoard = [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,9,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,9,1,2,
    6,7,8,9,1,2,3,4,5,
    9,1,2,3,4,5,6,7,8
  ];
  var vbCompressed = bn("1234567845678912789123452345678956789123891234563456789167891234");

  var validBoard2 = [
    9,8,7,6,5,4,3,2,1,
    6,5,4,3,2,1,9,8,7,
    3,2,1,9,8,7,6,5,4,
    8,7,6,5,4,3,2,1,9,
    5,4,3,2,1,9,8,7,6,
    2,1,9,8,7,6,5,4,3,
    7,6,5,4,3,2,1,9,8,
    4,3,2,1,9,8,7,6,5,
    1,9,8,7,6,5,4,3,2
  ];
  var vb2Compressed = bn("9876543265432198321987658765432154321987219876547654321943219876");

  var invalidBoard = [
    2,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,9,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,9,1,2,
    6,7,8,9,1,2,3,4,5,
    9,1,2,3,4,5,6,7,8
  ];

  var invalidBoard2 = [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,0,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,9,1,2,
    6,7,8,9,1,2,3,4,5,
    9,1,2,3,4,5,6,7,8
  ];

  var invalidBoard3 = [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,9,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,10,1,2,
    6,7,8,9,1,2,3,4,5,
    9,1,2,3,4,5,6,7,8
  ];

  var invalidBoard4 = [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,9,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,10,1,2,
    6,7,8,9,1,2,3,4,9,
    9,1,2,3,4,5,6,7,8
  ];

  var invalidBoard5 = [
    1,2,3,4,5,6,7,8,9,
    4,5,6,7,8,9,1,2,3,
    7,8,9,1,2,3,4,5,6,
    2,3,4,5,6,7,8,9,1,
    5,6,7,8,9,1,2,3,4,
    8,9,1,2,3,4,5,6,7,
    3,4,5,6,7,8,9,1,2
  ];

  console.log("testing");

  assert(sdkInstance.validateBoard(validBoard), "does not validate valid board");
  assert(sdkInstance.validateBoard(validBoard2), "does not validate valid board 2");
  assert(!sdkInstance.validateBoard(invalidBoard), "validated invalid board");
  assert(!sdkInstance.validateBoard(invalidBoard2), "validated invalid board 2");
  assert(!sdkInstance.validateBoard(invalidBoard3), "validated invalid board 3");
  assert(!sdkInstance.validateBoard(invalidBoard4), "validated invalid board 4");
  assert(!sdkInstance.validateBoard(invalidBoard5), "validated invalid board 5");

  assert(vbCompressed.eq(sdkInstance.compressBoard(validBoard)), "compression error");
  assert(vb2Compressed.eq(sdkInstance.compressBoard(validBoard2)), "compression error 2");

  var txAddr = sdkInstance.claimBoard.sendTransaction(validBoard, {from: eth.accounts[0], gas: maxGas});

  admin.sleepBlocks(2);

  var txAddr2 = sdkInstance.claimBoard.sendTransaction(validBoard, {from: eth.accounts[0], gas: maxGas});

  admin.sleepBlocks(2);

  var receipt = eth.getTransactionReceipt(txAddr);
  assert(receipt.blockNumber, "tx not confirmed");
  assert(receipt.gasUsed == 191310, "used gas changed to " + receipt.gasUsed);
  assert(
    sdkInstance.claimedBoards(vbCompressed),
    "board not claimed"
  );
  assert(sdkInstance.balanceOf(eth.accounts[0]) == 81, "balance not updated");
  assert(totalSupply.eq(sdkInstance.totalSupply()), "supply should not change");
  assert(bn("81").eq(sdkInstance.inCirculation()), "circulating amount should change");

  var receipt2 = eth.getTransactionReceipt(txAddr2);
  assert(receipt2.blockNumber, "tx confirmed wrongfully");

  var txAddr3 = sdkInstance.transfer.sendTransaction(testAccount, 82, {from: eth.accounts[0], gas: maxGas});

  admin.sleepBlocks(2);

  var receipt3 = eth.getTransactionReceipt(txAddr3);
  assert(receipt3.gasUsed == maxGas, "should burn all gas");

  var txAddr4 = sdkInstance.transfer.sendTransaction(testAccount, 3, {from: eth.accounts[0], gas: maxGas});

  admin.sleepBlocks(2);

  var receipt4 = eth.getTransactionReceipt(txAddr4);
  assert(receipt4.gasUsed < maxGas, "should not burn gas");
  assert(sdkInstance.balanceOf(eth.accounts[0]) == 78, "balance not updated 2");
  assert(sdkInstance.balanceOf(testAccount) == 3, "balance not updated 3");

  var txAddr5 = sdkInstance.burn.sendTransaction(81, {from: eth.accounts[0], gas: maxGas});

  admin.sleepBlocks(2);

  var receipt5 = eth.getTransactionReceipt(txAddr5);
  assert(receipt5.gasUsed == maxGas, "should burn all gas 2");
  assert(totalSupply.eq(sdkInstance.totalSupply()), "supply should not change 2");
  assert(bn("81").eq(sdkInstance.inCirculation()), "circulating amount should not change");

  var txAddr6 = sdkInstance.burn.sendTransaction(3, {from: testAccount, gas: maxGas});

  admin.sleepBlocks(2);

  var receipt6 = eth.getTransactionReceipt(txAddr6);
  assert(receipt6.gasUsed < maxGas, "should not burn gas 2");
  assert(totalSupply.sub(3).eq(sdkInstance.totalSupply()), "supply should change by burned sdk");
  assert(bn("78").eq(sdkInstance.inCirculation()), "circulating amount should change 2");

  // assert(testResults.events[0].event == "BoardClaimed", "wrong event");
  // assert(testResults.events[1].event == "Transfer", "wrong event 2");
  // assert(testResults.events[2].event == "Burn", "wrong event 3");
  // assert(testResults.events.length == 3, "wrong event count");

  assert(false, "done testing");
}

var bn = function(num) {
  return new BigNumber(num);
}

var log = function(obj) {
  console.log(JSON.stringify(obj));
}

var assert = function(exp, msg) {
  if (!exp) { console.log("!!! " + msg); }
}

var testAll = function() {
  console.log("unlocking account");
  personal.unlockAccount(eth.accounts[0], "test_password");

  console.log("loading contract");
  loadScript("sudokoin.js");
  var sdkContract = eth.contract(JSON.parse(sdkCompiled.contracts["sudokoin.sol:Sudokoin"].abi));
  var sdkInstance = sdkContract.new({ from: eth.accounts[0], data: "0x" + sdkCompiled.contracts["sudokoin.sol:Sudokoin"].bin, gas: 4700000},
    function (e, contract) {
      if (typeof contract.address !== 'undefined') {
           console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
           testInstance(sdkInstance);
      }
    }
  );
}

testAll();
