//SPDX_License_Identifer: unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
   address public feeAccount;
   uint256 public feePercent;
   mapping (address => mapping (address => uint256)) public tokens;
   event Deposit(address token, address user, uint256 amount, uint256 balance);
   event Withdraw(address token, address user, uint256 amount, uint256 balance);
   struct _Order {
      // Attributes of an order
      uint256 id; //Unique identifier for order
      address user; // User who made order
      address tokenGet; //Address of the token they receive
      uint256 amountGet; // Amount they receive
      address tokenGive; // Address of the token they give
      uint256 amountGive; //Amount they give
      uint256 timestamp; //When order was created
   }
   event Order(
      uint256 id,
      address user,
      address tokenGet,
      uint256 amountGet,
      address tokenGive,
      uint256 amountGive,
      uint256 timestamp
      );
   mapping(uint256 => _Order) public orders;
   uint256 public orderCount; 
   mapping(uint256 =>bool) public orderCancelled;
   event Cancel(
      uint256 id,
      address user,
      address tokenGet,
      uint256 amountGet,
      address tokenGive,
      uint256 amountGive,
      uint256 timestamp
      );

   constructor(address _feeAccount, uint256 _feePercent) {
      feeAccount= _feeAccount;
      feePercent= _feePercent;
   }



//-------------------------
// DEPOSIT & WITHDRAW TOKEN
function depositToken(address _token, uint256 _value)
public
{ //deposit token

   require(Token(_token).transferFrom(msg.sender, address(this), _value), 'transfer failed');
   

 //update balance

  tokens[_token][msg.sender]= tokens[_token][msg.sender] + _value ;

//emit deposit event
emit Deposit(_token, msg.sender, _value, tokens[_token][msg.sender]);
}

function withdrawToken(address _token, uint256 _value)
public
{

//Ensure user has enough tokens to withdraw
require(tokens[_token][msg.sender] >= _value, 'insufficient funds');
// withdraw token
Token(_token).transfer(msg.sender, _value);

// update balance
tokens[_token][msg.sender]=tokens[_token][msg.sender]- _value;

//emit withdraw event
emit Withdraw(_token, msg.sender, _value, tokens[_token][msg.sender]);
}


function balanceOf(address _token, address _user)
public
view
returns (uint256)
{
  return tokens[_token][_user];
}


//----------------------
// MAKE & CANCEL ORDERS
function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive)
public{

//Require token balance & Prevent orders if tokens aren't an exchang
require(balanceOf(_tokenGive,msg.sender)>= _amountGive);


//Create Order
orderCount=orderCount+1;

orders[orderCount]=_Order(
   orderCount,
   msg.sender,
   _tokenGet,
   _amountGet,
   _tokenGive,
   _amountGive,
   block.timestamp);
//Emit Event
emit Order(orderCount,msg.sender,_tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
}

function cancelOrder(uint256 _id) public{
   //Fetch order
_Order storage _order= orders[_id];
// require order exists
require(_order.id == _id);
// require authorized users;
require(_order.user== msg.sender);
   //Cancel the order
orderCancelled[_id]=true;
   //Emit event
emit Cancel(
   _order.id,
   msg.sender,
   _order.tokenGet,
   _order.amountGet,
   _order.tokenGive,
   _order.amountGive,
   block.timestamp
   );
}


}