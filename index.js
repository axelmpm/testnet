const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring')

async function restOperation(operation, url, endpoint, request) {

  const { header, data } = request;

  const config = {
    method: operation,
    url: url+endpoint+'?'+querystring.stringify(data),
    headers: header,
  }
  //console.log(config)
  try {
    const {req, res} = await axios(config);
    return req
  } catch (error) {
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

const signedOperation = (data, params) => {

  const header = {
    'Content-Type': 'application/json',
    'X-MBX-APIKEY': apiKey,
  }

  const signedData = { ...data, signature: signQuery(data) }

  const request = {
    header: header,
    data: signedData,
  }
  console.log(params.url+params.endpoint+'?'+querystring.stringify(signedData))
  //return restOperation(params.operation, params.url, params.endpoint, request);
}

const seeAccount = () => {

  const data = {
    timestamp: getTimeStamp(date),
  }
  const params = {
    operation: 'GET',
    url: url,
    endpoint: accountEndpoint,
}
  return signedOperation(data, params)
}

const sell = (symbol, quantity) => {

  const data = {
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

  return signedOperation(data, params)
}

//const url = 'http://localhost:3005'
const url = 'https://testnet.binance.vision'
const sellEndpoint = '/api/v3/order'
const accountEndpoint = '/api/v3/account'

const secret = 'L6kenliJi7CeD48DNabVynGpATGGZlqJRQArbQljwwDJO38oyz11n04TanT77aye';
const apiKey = 'IGxgRh6B4rwmi6TDdv8IpMHgsrqJaSu0tdc0qvIYX6b4T9mnJaCHWVW8qH2Ds8Nc';

const date = new Date();

seeAccount()
//sell('BTCUSDT', 0.01)
//console.log(seeAccount())
