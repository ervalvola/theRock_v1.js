# theRock_v1.js

Unofficial API wrapper for the v1 API of <a href="https://www.therocktrading.com">www.therocktrading.com</a>. Refer to 
the <a href="https://api.therocktrading.com/doc/v1/index.html">official documentation</a> for an explanation of each api call.

Tips are very much appreciated: 18s8sDkWsnp9F91CaGpb8o4SoRKT351iRW

## Usage

All callbacks should follow node's standard `callback = function(error, result)`

### 
```javascript
	var TheRock = require('./theRock_v1.js')
	var trt = new TheRock(your_public_api_key, your_secret_api_key)
	
	trt.balances('BTC', function(err,res) {
		console.log(err,res)
	})

```
Api keys are not required for public methods. 


### Basic API

* [balances](#balances)
* [discounts](#balances)
* [withdrawLimits](#balances)

### Market API

* [funds](#funds)
* [fund](#fund)
* [orderbook](#orderbook)
* [tickers](#tickers)
* [ticker](#ticker)
* [trades](#trades)

### Trading API

* [showOrders](#showOrders)
* [showOrder](#showOrder)
* [cancelAllOrders](#cancelAllOrders)
* [cancelOrder](#cancelOrder)
* [placeOrder](#placeOrder)
* [userTrades](#userTrades)
* [transactions](#transactions)
* [transaction](#transaction)

### ATM API

* [withdraw](#withdraw)


### Meta

* [set](#set)
* [formatDate](#formatDate)




#	Basic API


<a name="balances">
###balances(currency, callback) 
</a>

* `currency` is optional

<a name="discounts">discounts</a> and <a name= wihdrawLimits>withdrawLimits</a> follow the same sintax.


#	Market API

<a name="funds">
###funds(callback)</a>
<a name="tickers">tickers</a> follow the same sintax


<a name="fund">
###fund(fund,callback)</a>
* `fund`  the symbol of the chosen market

<a name="ticker">ticker</a> and <a name="orderbook">orderbook</a> follow the same sintax


<a name="trades">
###trades(fund, params, callback)</a>
* `fund`  the symbol of the chosen market
* `params` an object with properties specified exactly as in the official <a href="https://api.therocktrading.com/doc/v1/">docs</a>. 



# Trading API



<a name="showOrders">
###showOrders(fund, callback)</a>
* `fund`  the symbol of the chosen market

<a name="cancelAllOrders">cancelAllOrders</a> follow the same sintax

<a name="showOrder">
###showOrder(fund, id, callback)</a>
* `fund`  the symbol of the chosen market
* `id`  the id of the order to be visualized.

<a name="cancelOrder">cancelOrder</a> follow the same sintax


<a name="placeOrder">
###placeOrder(fund, params, callback)</a>
* `fund`  the symbol of the chosen market
* `params` an object with properties specified exactly as in the official <a href="https://api.therocktrading.com/doc/v1/">docs</a>. 

<a name="userTrades">
###userTrades(fund, params, callback)</a>
* `fund`  the symbol of the chosen market
* `params` an object with properties specified exactly as in the official <a href="https://api.therocktrading.com/doc/v1/">docs</a>. 


<a name="transactions">
###transactions(params, callback)</a>
* `params` an object with properties specified exactly as in the official <a href="https://api.therocktrading.com/doc/v1/">docs</a>. 



<a name="transaction">
###transaction(id, callback)</a>
* `id` the id of the transaction to be visualized



# ATM API

<a name="withdraw">
###withdraw(params, callback)</a>

* `params` an object with properties specified exactly as in the official <a href="https://api.therocktrading.com/doc/v1/">docs</a>. 




# Meta


<a name="set">
###set(parameter, value)</a>
set the value of the set the value of the `parameter` to the `value` specified. Currently is only useful to set a `timeoutINTERVAL` to every http request.

<a name="formatDate">
###formatDate(unix)</a>
convert `unix` times to the right format accepted by the website (basicly only a ".toISOString()" method applied over a number... just to remember it)

