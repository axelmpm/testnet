async function restOperation(operation, url, endpoint, request) {

  const { header, query} = request;

  const config = {
    method: operation,
    baseURL: url,
    url: endpoint+'?'+querystring.stringify(query),
    headers: header,
  }
  let response;
  try{
    const {data} = await axios(config)
    response = data
  } catch (error){
    console.log(error)
  }
  return response
}

const signQuery = (query) => {
  return crypto
    .createHmac('sha256', secret)
    .update(querystring.stringify(query))
    .digest('hex');
}

const getTimeStamp = (date) => {
  return date.getTime();
}

async function signedOperation(query, params){

  const header = {
    'Content-Type': 'application/json',
    'X-MBX-APIKEY': apiKey,
  }

  const signedQuery = { ...query, signature: signQuery(query) }

  const request = {
    header: header,
    query: signedQuery,
  }
  return restOperation(params.operation, params.url, params.endpoint, request)
}

async function seeAccount(){

  const query = {
    timestamp: getTimeStamp(date),
  }
  const params = {
    operation: 'GET',
    url: url,
    endpoint: accountEndpoint,
  }
  return signedOperation(query, params)
}

async function sell(symbol, quantity){

  const query = {
    symbol: symbol,
    side: 'SELL',
    type: 'MARKET',
    quantity: quantity,
    newClientOrderId: 'my_order_id_2',
    newOrderRespType: 'ACK',
    timestamp: getTimeStamp(date),
  }
  const params = {
    operation: 'POST',
    url: url,
    endpoint: sellEndpoint,
  }

  return signedOperation(query, params)
}

async function buy(symbol, quantity){

  const query = {
    symbol: symbol,
    side: 'BUY',
    type: 'MARKET',
    quantity: quantity,
    newClientOrderId: 'my_order_id_3',
    newOrderRespType: 'ACK',
    timestamp: getTimeStamp(date),
  }
  const params = {
    operation: 'POST',
    url: url,
    endpoint: sellEndpoint,
  }

  return signedOperation(query, params)
}

async function allOrders(symbol){

  const query = {
    symbol: symbol,
    limit: 500,
    timestamp: getTimeStamp(date),
  }
  const params = {
    operation: 'GET',
    url: url,
    endpoint: allOrdersEndpoint,
  }

  return signedOperation(query, params)
}

const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring')

const date = new Date();

const url = 'https://testnet.binance.vision'
const sellEndpoint = '/api/v3/order'
const accountEndpoint = '/api/v3/account'
const allOrdersEndpoint = '/api/v3/allOrders'

const secret = 'L6kenliJi7CeD48DNabVynGpATGGZlqJRQArbQljwwDJO38oyz11n04TanT77aye';
const apiKey = 'IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc';

async function main(){
  
  //console.log(await allOrders('BTCUSDT'))
  console.log(await seeAccount())
  await buy('BTCUSDT', 0.01)
  console.log(await seeAccount())
  await sell('BTCUSDT', 0.02)
  console.log(await seeAccount())
}

main()
