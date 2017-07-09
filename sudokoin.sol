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

  function validateBoard(uint[81] board) constant returns(bool) {
    uint[3][3] memory blocks;
    uint[9] memory rows;
    uint[9] memory cols;

    for (uint row = 0; row < 9; row++) {
      for (uint col = 0; col < 9; col++) {
        uint val = board[row*9+col];
        if (
          val == 0 ||
          val > 9 ||
          setIncludes(blocks[row/3][col/3], val) ||
          setIncludes(rows[row], val) ||
          setIncludes(cols[col], val)
        ) {
          return false;
        }
        rows[row] = addToSet(rows[row], val);
        cols[col] = addToSet(cols[col], val);
        blocks[row/3][col/3] = addToSet(blocks[row/3][col/3], val);
      }
    }
    return true;
  }

  function setIncludes(uint set, uint val) private returns (bool) {
    return set & (1 << val) != 0;
  }

  function addToSet(uint set, uint val) private returns (uint) {
    return set | (1 << val);
  }
}
