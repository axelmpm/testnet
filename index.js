'use strict';

const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

const nowDate = new Date();
const BASE_TOKEN = 'USDT';

const marketUrl = 'https://testnet.binance.vision';
const sellEndpoint = '/api/v3/order';
const accountEndpoint = '/api/v3/account';
const allOrdersEndpoint = '/api/v3/allOrders';

const SECRET = 'L6kenliJi7CeD48DNabVynGpATGGZlqJRQArbQljwwDJO38oyz11n04TanT77aye'.replace(/\n/g, '');
const API_KEY = 'IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc'.replace(/\n/g, '');

const signQuery = (secret, msg) => {
	return crypto
		.createHmac('sha256', secret)
		.update(querystring.stringify(msg))
		.digest('hex');
};

const getTimeStamp = date => {
	return date.getTime();
};

async function restOperation(operation, url, endpoint, request) {
	const { header, query } = request;

	const config = {
		method: operation,
		baseURL: url,
		url: endpoint + '?' + querystring.stringify(query),
		headers: header,
	};
	let response;
	try {
		const { data } = await axios(config);
		response = data;
	} catch (error) {
		// TODO: throw 'couldn't perform market operation' exception
		console.log(error);
	}
	return response;
}

async function signedOperation(query, params) {
	const header = {
		'Content-Type': 'application/json',
		'X-MBX-APIKEY': params.apiKey,
	};

	const queryTimeStamped = {
		...query,
		recvWindow: 50000,
		timestamp: getTimeStamp(nowDate),
	};

	const signedQuery = { 
    ...queryTimeStamped,
    signature: signQuery(params.secret, queryTimeStamped)
  };

	const request = {
		header,
		query: signedQuery,
	};

	return restOperation(params.operation, params.url, params.endpoint, request);
}

async function seeAccount(secret, apiKey) {

	const query = {};

	const params = {
		secret,
		apiKey,
		operation: 'GET',
		url: marketUrl,
		endpoint: accountEndpoint,
	};
	return signedOperation(query, params);
}

async function getWalletToken(secret, apiKey, symbol) {

	const { balances } = await seeAccount(secret, apiKey);

	let token;
	balances.forEach(aToken => {
		if (aToken.asset === symbol) {
			token = aToken;
		}
	});

	if (token == null) {
	// throw
	}

	return token.free;
}

async function sell(secret, apiKey, symbol, quantity) {
	const query = {
		secret,
		apiKey,
		symbol: symbol + BASE_TOKEN,
		side: 'SELL',
		type: 'MARKET',
		quantity,
		newClientOrderId: 'my_order_id_2',
		newOrderRespType: 'ACK',
	};
	const params = {
		operation: 'POST',
		url: marketUrl,
		endpoint: sellEndpoint,
	};

	return signedOperation(query, params);
}

async function buy(secret, apiKey, symbol, quantity) {
	const query = {
		secret,
		apiKey,
		symbol: symbol + BASE_TOKEN,
		side: 'BUY',
		type: 'MARKET',
		quantity,
		newClientOrderId: 'my_order_id_3',
		newOrderRespType: 'ACK',
	};
	const params = {
		operation: 'POST',
		url: marketUrl,
		endpoint: sellEndpoint,
	};
	return signedOperation(query, params);
}

async function allOrders(secret, apiKey, symbol) {
	const query = {
		secret,
		apiKey,
		symbol: symbol + BASE_TOKEN,
		limit: 5,
	};
	const params = {
		operation: 'GET',
		url: marketUrl,
		endpoint: allOrdersEndpoint,
	};
	return signedOperation(query, params);
}

async function main(){
  
  //console.log(await allOrders(SECRET, API_KEY, 'BTCUSDT'))
  console.log(await seeAccount(SECRET, API_KEY))
  //await buy(SECRET, API_KEY, 'BTCUSDT', 0.01)
  //console.log(await seeAccount(SECRET, API_KEY))
  //await sell(SECRET, API_KEY, 'BTCUSDT', 0.02)
  //console.log(await seeAccount(SECRET, API_KEY))
  //console.log(await getWalletToken(SECRET, API_KEY, 'BTCUSDT'))
}

main()
