
		//dependencies	 
 		var crypto  = require('crypto'),
     		 request = require('request')
     
     
     
module.exports = function (PUBLIC, SECRET) {
		
		//id
		if (PUBLIC) this.PUBLIC = PUBLIC;
		if (SECRET) this.SECRET = SECRET;
		
		//params
		this.url = 'https://api.therocktrading.com/v1/'
		this.timeoutINTERVAL; //milliseconds
		this.nonce;
		
		//functions
		this.set = set;
		this.newNonce = newNonce;
		this._request = _request;
		this._cancelAll = _cancelAll;
		this._basic = _basic;
		this.formatDate = formatDate;
		
		//MARKET API - permission: none
		this.fund = function(fund,callback) { check(fund); return this._request('get', false, 'funds/'+fund, callback) } ;
		this.funds = function(callback) { return this._request('get', false, 'funds', callback) } ;
		this.orderbook = function(fund, callback) { check(fund); return this._request('get', false, 'funds/'+fund+'/orderbook', callback)  }
		this.ticker = function(fund, callback) { check(fund); return this._request('get', false, 'funds/'+fund+'/ticker', callback)  }
		this.tickers = function(callback) { return this._request('get', false, 'funds/tickers', callback)  }
		this.trades = function(fund, params, callback) { check(fund); return this._request('get', false, 'funds/'+fund+'/trades', params, callback)  }
		
		//BASIC API - permission: basic
		this.balances = function (currency, callback) {  return this._basic('balances', currency, callback)   } 
		this.discounts = function (currency, callback) {  return this._basic('discounts', currency, callback)   } 
		this.withdrawLimits = function (currency, callback) {  return this._basic('withdraw_limits', currency, callback)   } 
		
		//TRADING API - permission: basic/trading
		this.showOrders = function (fund, callback) { check(fund); return this._request('get', true, 'funds/'+fund+'/orders', callback)}
		this.showOrder = function (fund, id, callback) { check(fund); checkN(id); return this._request('get', true, 'funds/'+fund+'/orders/'+id, callback)}
		this.cancelAllOrders = function(fund, callback) { check(fund); return this._cancelAll('funds/'+fund+'/orders/remove_all', callback) }
		this.cancelOrder = function(fund, id, callback) { check(fund); checkN(id); return this._request('del', true, 'funds/'+fund+'/orders/'+id, callback) }
		this.placeOrder = function(fund, params, callback) { check(fund); return this._request('post', true, 'funds/'+fund+'/orders', params, callback) }

		this.userTrades = function(fund, params, callback) { check(fund); return this._request('get', true, 'funds/'+fund+'/trades', params, callback ) }
		this.transactions = function(params, callback) { return this._request('get', true, 'transactions', params, callback ) }
		this.transaction = function(id, callback) { return this._request('get', true, 'transactions/'+id, callback ) }

		//ATM API - permission: withdraw
		this.withdraw = function(params, callback) { return this._request('post', true, 'atms/withdraw', params, callback) }

}

function newNonce() {
	var self = this;
	var now = new Date().getTime();
	
	if ( now <= self.nonce ) {
			self.nonce = now+1
			return self.nonce	
	}	
	else {
			self.nonce = now
			return self.nonce	
	}
}


function _request(method, auth, path, params, cb) {    //method = post/get/del,  auth = true/false 

		if ( typeof params == 'function' ) { cb = params; params = false}
		
		var self = this;	
									  var options = {}
									  		options.url = self.url+path

		if ( self.timeoutINTERVAL ) options.timeout = self.timeoutINTERVAL
	
											options.headers = {}
											options.headers['content-type'] = 'application/json'
		
		if (params && method == 'get') 	options.url += '?'+urlify(params)	
	
	
		if (auth) {
		if (!self.PUBLIC || !self.SECRET) return cb('no API keys provided', null)
		
											options.headers['X-TRT-KEY'] = self.PUBLIC;
											options.headers['X-TRT-NONCE'] = self.newNonce();	
											options.headers['X-TRT-SIGN'] = crypto.createHmac('sha512', self.SECRET).update( options.headers['X-TRT-NONCE'] + options.url ).digest('hex');
		}  	
		
		
		if (params && method == 'get') {
														request[method](options, callback)
		} else 
		if (params && method == 'post') {
														request[method](options, callback).form(params)
		} 
		else {
														request[method](options, callback)
		}

	  								

	  	function callback(err,res) {
	  		if (err)															return cb(err, res)
	  		if ( res.hasOwnProperty('headers') && res.headers.hasOwnProperty('status')  && res.hasOwnProperty('body') ) {
	  			if (res.headers.status != '200 OK') 		return cb(res.headers.status, res.body)
	  			else { 
					try 											{	var json = JSON.parse(res.body)        }
					catch (e) 									{	return cb(e, null)						   }
																		return cb(null, json ) 
	  			}													
	  		} 
	  		else 														return cb('http error', null)
		}
		
}

function _basic(api, id, callback) {
				var path;
				if (typeof id === 'string') path = api+'/'+id
				else { path = api; callback = id }
				return this._request('get', true, path, callback)
}

function _cancelAll( path, cb) {   

		var self = this;
									  var options = {}
									  		options.url = self.url+path

		if ( self.timeoutINTERVAL ) options.timeout = self.timeoutINTERVAL
	
											options.headers = {}
											options.headers['content-type'] = 'application/json'
											options.headers['X-TRT-KEY'] = self.PUBLIC;
											options.headers['X-TRT-NONCE'] = self.newNonce();	
											options.headers['X-TRT-SIGN'] = crypto.createHmac('sha512', self.SECRET).update( options.headers['X-TRT-NONCE'] + options.url ).digest('hex');

	  										request.del(options, callback)

	  	function callback(err,res) {
	  		if (err)															return cb(err, res)
	  		if ( res.hasOwnProperty('headers') && res.headers.hasOwnProperty('status')  && res.hasOwnProperty('body') ) {
	  			if (res.headers.status == '204 No Content') 		return cb(null, true)
	  			else 															return cb(res.headers.status, res.body)
   		}
   		else 																return cb('http error', null)
		}
		
}

function set(param, value) { this[param] = value }

//utilities
function check(string) 	{ if (typeof string != 'string')	   throw 'wrong arguments' }
function checkN(id) 		{ if (typeof id != 'number')			throw 'wrong arguments' }
function urlify(params) {
	var string = ''
	var i = 0;
	for (prop in params) {
		if ( i != 0 ) string += '\&'
		string += prop+'='+params[prop]
		i++
	}
	return string
}

function formatDate(unix) {
	return new Date(unix).toISOString()
}
