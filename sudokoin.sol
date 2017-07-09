pragma solidity ^0.4.11;

contract Sudokoin {
  uint public totalSupply = 6670903752021072936960 * 81;
  uint public inCirculation = 0;

  mapping (address => uint) public balanceOf;
  mapping (uint => bool) public claimedBoards;

  event BoardClaimed(uint board, address by);
  event Burn(address indexed from, uint value);
  event Transfer(address indexed from, address indexed to, uint value);

  function claimBoard(uint[81] b) {
    // 4 + 81 * 32
    // if(msg.data.length != 2596) throw;
    if(!validateBoard(b)) throw;
    uint cb = compressBoard(b);
    if (!claimedBoards[cb]) {
      claimedBoards[cb] = true;
      balanceOf[msg.sender] += 81;
      inCirculation += 81;
      BoardClaimed(cb, msg.sender);
    }
  }

  function transfer(address to, uint value) {
      // 4 + 32 + 32
      // if(msg.data.length != 68) throw;
      if (to == 0x0) throw; // use burn!
      if (balanceOf[msg.sender] < value) throw;
      if (balanceOf[to] + value < balanceOf[to]) throw;
      balanceOf[msg.sender] -= value;
      balanceOf[to] += value;
      Transfer(msg.sender, to, value);
  }

  function burn(uint value) {
      // 4 + 32
      // if(msg.data.length != 36) throw;
      if (balanceOf[msg.sender] < value) throw;
      balanceOf[msg.sender] -= value;
      totalSupply -= value;
      inCirculation -= value;
      Burn(msg.sender, value);
  }

  // compressBoard removes last col and last row and joins digits into one number.
  function compressBoard(uint[81] b) constant returns (uint) {
    uint cb = 0;
    uint mul = 1000000000000000000000000000000000000000000000000000000000000000;
    for (uint i = 0; i < 72; i++) {
      if (i % 9 == 8) {
        continue;
      }
      cb = cb + mul * b[i];
      mul = mul / 10;
    }
    return cb;
  }

  function validateBoard(uint[81] b) constant returns (bool) {
    return
      // rows
      validateSet( b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8]) &&
      validateSet( b[9],b[10],b[11],b[12],b[13],b[14],b[15],b[16],b[17]) &&
      validateSet(b[18],b[19],b[20],b[21],b[22],b[23],b[24],b[25],b[26]) &&
      validateSet(b[27],b[28],b[29],b[30],b[31],b[32],b[33],b[34],b[35]) &&
      validateSet(b[36],b[37],b[38],b[39],b[40],b[41],b[42],b[43],b[44]) &&
      validateSet(b[45],b[46],b[47],b[48],b[49],b[50],b[51],b[52],b[53]) &&
      validateSet(b[54],b[55],b[56],b[57],b[58],b[59],b[60],b[61],b[62]) &&
      validateSet(b[63],b[64],b[65],b[66],b[67],b[68],b[69],b[70],b[71]) &&
      validateSet(b[72],b[73],b[74],b[75],b[76],b[77],b[78],b[79],b[80]) &&

      // cols
      validateSet(b[0], b[9],b[18],b[27],b[36],b[45],b[54],b[63],b[72]) &&
      validateSet(b[1],b[10],b[19],b[28],b[37],b[46],b[55],b[64],b[73]) &&
      validateSet(b[2],b[11],b[20],b[29],b[38],b[47],b[56],b[65],b[74]) &&
      validateSet(b[3],b[12],b[21],b[30],b[39],b[48],b[57],b[66],b[75]) &&
      validateSet(b[4],b[13],b[22],b[31],b[40],b[49],b[58],b[67],b[76]) &&
      validateSet(b[5],b[14],b[23],b[32],b[41],b[50],b[59],b[68],b[77]) &&
      validateSet(b[6],b[15],b[24],b[33],b[42],b[51],b[60],b[69],b[78]) &&
      validateSet(b[7],b[16],b[25],b[34],b[43],b[52],b[61],b[70],b[79]) &&
      validateSet(b[8],b[17],b[26],b[35],b[44],b[53],b[62],b[71],b[80]) &&

      // blocks
      validateSet( b[0], b[1], b[2], b[9],b[10],b[11],b[18],b[19],b[20]) &&
      validateSet(b[27],b[28],b[29],b[36],b[37],b[38],b[45],b[46],b[47]) &&
      validateSet(b[54],b[55],b[56],b[63],b[64],b[65],b[72],b[73],b[74]) &&
      validateSet( b[3], b[4], b[5],b[12],b[13],b[14],b[21],b[22],b[23]) &&
      validateSet(b[30],b[31],b[32],b[39],b[40],b[41],b[48],b[49],b[50]) &&
      validateSet(b[57],b[58],b[59],b[66],b[67],b[68],b[75],b[76],b[77]) &&
      validateSet( b[6], b[7], b[8],b[15],b[16],b[17],b[24],b[25],b[26]) &&
      validateSet(b[33],b[34],b[35],b[42],b[43],b[44],b[51],b[52],b[53]) &&
      validateSet(b[60],b[61],b[62],b[69],b[70],b[71],b[78],b[79],b[80]);
  }

  function validateSet(uint v1, uint v2, uint v3, uint v4, uint v5, uint v6, uint v7, uint v8, uint v9) private returns (bool) {
    uint set = addToSet(0, v1);
    if (setIncludes(set, v2)) { return false; }
    set = addToSet(set, v2);
    if (setIncludes(set, v3)) { return false; }
    set = addToSet(set, v3);
    if (setIncludes(set, v4)) { return false; }
    set = addToSet(set, v4);
    if (setIncludes(set, v5)) { return false; }
    set = addToSet(set, v5);
    if (setIncludes(set, v6)) { return false; }
    set = addToSet(set, v6);
    if (setIncludes(set, v7)) { return false; }
    set = addToSet(set, v7);
    if (setIncludes(set, v8)) { return false; }
    set = addToSet(set, v8);
    if (setIncludes(set, v9)) { return false; }
    return true;
  }

  function setIncludes(uint set, uint val) private returns (bool) {
    return val == 0 || val > 9 || set & (1 << val) != 0;
  }

  function addToSet(uint set, uint val) private returns (uint) {
    return set | (1 << val);
  }
}
