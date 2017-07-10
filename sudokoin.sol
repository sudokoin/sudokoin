pragma solidity ^0.4.11;

contract Sudokoin {
  uint public totalSupply = 6670903752021072936960 * 81;
  uint public inCirculation = 0;

  string public constant name = "Sudokoin";
  string public constant symbol = "SDK";
  uint8 public constant decimals = 0;

  mapping (address => mapping (address => uint)) public allowance;
  mapping (address => uint) public balanceOf;
  mapping (uint => bool) public claimedBoards;

  event Approval(address indexed _owner, address indexed _spender, uint _value);
  event BoardClaimed(uint _board, address _by);
  event Burn(address indexed _from, uint _value);
  event Transfer(address indexed _from, address indexed _to, uint _value);

  function claimBoard(uint[81] _b) returns (bool success) {
    require(validateBoard(_b));
    uint cb = compressBoard(_b);
    if (!claimedBoards[cb]) {
      claimedBoards[cb] = true;
      balanceOf[msg.sender] += 81;
      inCirculation += 81;
      BoardClaimed(cb, msg.sender);
      return true;
    }
    return false;
  }

  function approve(address _spender, uint _value) returns (bool success) {
      require(msg.data.length >= 68);
      allowance[msg.sender][_spender] = _value;
      Approval(msg.sender, _spender, _value);
      return true;
  }

  function transfer(address _to, uint _value) returns (bool success) {
      require(msg.data.length >= 68);
      require(_to != 0x0); // use burn!
      require(_value <= balanceOf[msg.sender]);
      require(_value + balanceOf[_to] >= balanceOf[_to]);
      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;
      Transfer(msg.sender, _to, _value);
      return true;
  }

  function transferFrom(address _from, address _to, uint _value) returns (bool success) {
      require(msg.data.length >= 100);
      require(_to != 0x0); // use burnFrom!
      require(_value <= balanceOf[_from]);
      require(_value <= allowance[_from][msg.sender]);
      require(_value + balanceOf[_to] >= balanceOf[_to]);
      balanceOf[_from] -= _value;
      balanceOf[_to] += _value;
      allowance[_from][msg.sender] -= _value;
      Transfer(_from, _to, _value);
      return true;
  }

  function burn(uint _value) {
      require(_value <= balanceOf[msg.sender]);
      balanceOf[msg.sender] -= _value;
      totalSupply -= _value;
      inCirculation -= _value;
      Burn(msg.sender, _value);
  }

  function burnFrom(address _from, uint _value) returns (bool success) {
      require(_value <= balanceOf[_from]);
      require(_value <= allowance[_from][msg.sender]);
      balanceOf[_from] -= _value;
      totalSupply -= _value;
      inCirculation -= _value;
      Burn(_from, _value);
      return true;
  }

  // compressBoard removes last col and last row and joins digits into one number.
  function compressBoard(uint[81] _b) constant returns (uint) {
    uint cb = 0;
    uint mul = 1000000000000000000000000000000000000000000000000000000000000000;
    for (uint i = 0; i < 72; i++) {
      if (i % 9 == 8) {
        continue;
      }
      cb = cb + mul * _b[i];
      mul = mul / 10;
    }
    return cb;
  }

  function validateBoard(uint[81] _b) constant returns (bool) {
    return
      // rows
      validateSet( _b[0], _b[1], _b[2], _b[3], _b[4], _b[5], _b[6], _b[7], _b[8]) &&
      validateSet( _b[9],_b[10],_b[11],_b[12],_b[13],_b[14],_b[15],_b[16],_b[17]) &&
      validateSet(_b[18],_b[19],_b[20],_b[21],_b[22],_b[23],_b[24],_b[25],_b[26]) &&
      validateSet(_b[27],_b[28],_b[29],_b[30],_b[31],_b[32],_b[33],_b[34],_b[35]) &&
      validateSet(_b[36],_b[37],_b[38],_b[39],_b[40],_b[41],_b[42],_b[43],_b[44]) &&
      validateSet(_b[45],_b[46],_b[47],_b[48],_b[49],_b[50],_b[51],_b[52],_b[53]) &&
      validateSet(_b[54],_b[55],_b[56],_b[57],_b[58],_b[59],_b[60],_b[61],_b[62]) &&
      validateSet(_b[63],_b[64],_b[65],_b[66],_b[67],_b[68],_b[69],_b[70],_b[71]) &&
      validateSet(_b[72],_b[73],_b[74],_b[75],_b[76],_b[77],_b[78],_b[79],_b[80]) &&

      // cols
      validateSet(_b[0], _b[9],_b[18],_b[27],_b[36],_b[45],_b[54],_b[63],_b[72]) &&
      validateSet(_b[1],_b[10],_b[19],_b[28],_b[37],_b[46],_b[55],_b[64],_b[73]) &&
      validateSet(_b[2],_b[11],_b[20],_b[29],_b[38],_b[47],_b[56],_b[65],_b[74]) &&
      validateSet(_b[3],_b[12],_b[21],_b[30],_b[39],_b[48],_b[57],_b[66],_b[75]) &&
      validateSet(_b[4],_b[13],_b[22],_b[31],_b[40],_b[49],_b[58],_b[67],_b[76]) &&
      validateSet(_b[5],_b[14],_b[23],_b[32],_b[41],_b[50],_b[59],_b[68],_b[77]) &&
      validateSet(_b[6],_b[15],_b[24],_b[33],_b[42],_b[51],_b[60],_b[69],_b[78]) &&
      validateSet(_b[7],_b[16],_b[25],_b[34],_b[43],_b[52],_b[61],_b[70],_b[79]) &&
      validateSet(_b[8],_b[17],_b[26],_b[35],_b[44],_b[53],_b[62],_b[71],_b[80]) &&

      // blocks
      validateSet( _b[0], _b[1], _b[2], _b[9],_b[10],_b[11],_b[18],_b[19],_b[20]) &&
      validateSet(_b[27],_b[28],_b[29],_b[36],_b[37],_b[38],_b[45],_b[46],_b[47]) &&
      validateSet(_b[54],_b[55],_b[56],_b[63],_b[64],_b[65],_b[72],_b[73],_b[74]) &&
      validateSet( _b[3], _b[4], _b[5],_b[12],_b[13],_b[14],_b[21],_b[22],_b[23]) &&
      validateSet(_b[30],_b[31],_b[32],_b[39],_b[40],_b[41],_b[48],_b[49],_b[50]) &&
      validateSet(_b[57],_b[58],_b[59],_b[66],_b[67],_b[68],_b[75],_b[76],_b[77]) &&
      validateSet( _b[6], _b[7], _b[8],_b[15],_b[16],_b[17],_b[24],_b[25],_b[26]) &&
      validateSet(_b[33],_b[34],_b[35],_b[42],_b[43],_b[44],_b[51],_b[52],_b[53]) &&
      validateSet(_b[60],_b[61],_b[62],_b[69],_b[70],_b[71],_b[78],_b[79],_b[80]);
  }

  function validateSet(uint _v1, uint _v2, uint _v3, uint _v4, uint _v5, uint _v6, uint _v7, uint _v8, uint _v9) private returns (bool) {
    uint set = addToSet(0, _v1);
    if (setIncludes(set, _v2)) { return false; }
    set = addToSet(set, _v2);
    if (setIncludes(set, _v3)) { return false; }
    set = addToSet(set, _v3);
    if (setIncludes(set, _v4)) { return false; }
    set = addToSet(set, _v4);
    if (setIncludes(set, _v5)) { return false; }
    set = addToSet(set, _v5);
    if (setIncludes(set, _v6)) { return false; }
    set = addToSet(set, _v6);
    if (setIncludes(set, _v7)) { return false; }
    set = addToSet(set, _v7);
    if (setIncludes(set, _v8)) { return false; }
    set = addToSet(set, _v8);
    if (setIncludes(set, _v9)) { return false; }
    return true;
  }

  function setIncludes(uint _set, uint _number) private returns (bool success) {
    return _number == 0 || _number > 9 || _set & (1 << _number) != 0;
  }

  function addToSet(uint _set, uint _number) private returns (uint set) {
    return _set | (1 << _number);
  }
}
