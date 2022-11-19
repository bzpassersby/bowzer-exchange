//SPDX_License_Identifer: unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
   address public feeAccount;
   uint256 public feePercent;
   mapping (address => mapping (address => uint256)) public tokens;
   event Deposit(address token, address user, uint256 amount, uint256 balance);

   constructor(address _feeAccount, uint256 _feePercent) {
      feeAccount= _feeAccount;
      feePercent= _feePercent;
   }



//---------------
// DEPOSIT & WITHDRAW TOKEN
function depositToken(address _token, uint256 _value)
public
returns (bool success)
{ //deposit token

   require(Token(_token).transferFrom(msg.sender, address(this), _value), 'transfer failed');
   

 //update balance

  tokens[_token][msg.sender]= tokens[_token][msg.sender] + _value ;

//emit deposit event
emit Deposit(_token, msg.sender, _value, tokens[_token][msg.sender]);

return true;
}

function balanceOf(address _token, address _user)
public
view
returns (uint256)
{
  return tokens[_token][_user];

}

}