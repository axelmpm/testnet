const axios = require('axios');
const crypto = require('crypto');
const { response } = require('express');
const querystring = require('querystring')

async function restOperation(operation, url, endpoint, request) {

  const { header, query} = request;

  const config = {
    method: operation,
    url: url+endpoint+'?'+querystring.stringify(query),
    headers: header,
  }/*
  //console.log(config)
  let resp;
  resp = axios(config).then(response => {
    //console.log(response.data)
    a = response.data
  }).catch(error => {
    console.log(error)
  })
  return resp*/
  try{
    const {data} = await axios(config)
    return data
  } catch (error){
    console.log(error)
  }
}

const signQuery = (query) => {
  return crypto
    .createHmac('sha256', secret)
    .update(querystring.stringify(query))
    .digest('hex');
}

const getTimeStamp = (date) => {return date.getTime();}

const signedOperation = (query, params) => {

  const header = {
    'Content-Type': 'application/json',
    'X-MBX-APIKEY': apiKey,
  }

  const signedQuery = { ...query, signature: signQuery(query) }

  const request = {
    header: header,
    query: signedQuery,
  }
  return restOperation(params.operation, params.url, params.endpoint, request);
}

const seeAccount = () => {

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

const sell = (symbol, quantity) => {

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

//const url = 'http://localhost:3005'
const url = 'https://testnet.binance.vision'
const sellEndpoint = '/api/v3/order'
const accountEndpoint = '/api/v3/account'

const secret = 'L6kenliJi7CeD48DNabVynGpATGGZlqJRQArbQljwwDJO38oyz11n04TanT77aye';
const apiKey = 'IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc';

const date = new Date();

console.log(seeAccount())
//sell('BTCUSDT', 0.01)
//console.log(seeAccount())
