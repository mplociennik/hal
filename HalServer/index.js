var moment = require('moment');
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8083});
const WEBSOCKET_LOG_CLIENT_NAME = 'websocketLogSender';

console.log('Server listening...');

function heartbeat() {
  this.isAlive = true;
}

wss.getClientByType = function(clientType){
  var client = null;
  wss.clients.forEach(function each(item){
    if (item.client === clientType) {
      client = item;
    }else{
      wss.renderMessage('Not found client type: ' + clientType);
    }
  });
  return client;
};

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      wss.renderMessage("Sending data: " + data);
      client.send(data);
    }else{
      wss.renderMessage('Client not ready: ' + client.client);
    }
  });
};

// Broadcast by client name.
wss.broadcastByClientName = function broadcast(clientName, data) {
  dataString = JSON.stringify(data);
  state = false;
  console.log('broadcastByClientName clientName: ', clientName);
  wss.clients.forEach(function each(client) {
    if (client.client === clientName && client.readyState === WebSocket.OPEN) {
      state = true;
      wss.renderMessage("Sending data: " + dataString);
      client.send(dataString);
    }
  });
  
  return state;
};

wss.renderMessage = function(message){
  console.log('**********************************************');
  console.log(moment().format() + ": " + message)
  console.log('**********************************************');
  return true;
}

wss.receiveServerRequest = function(ws, dataObj){
    if (typeof dataObj.event !== 'undefined') {
      switch(dataObj.event){
        case 'init':
          ws.client = dataObj.from;
          dataJson = JSON.stringify({from: "server", to: dataObj['from'], event:'message', data:{message: 'Init ready!'}});
          ws.send(dataJson);
          break;
        case 'message':
          wss.renderMessage('Message from "' + dataObj.from + '": ' + dataObj.data.message);
          break;
      }    
  }else{
    console.log('Event is undefined: ', dataObj);
  }
};

wss.sendWebsocketLog = function(data){
  state = wss.broadcastByClientName(WEBSOCKET_LOG_CLIENT_NAME, data);
  if(!state){
    console.log('Websocket Log Client is not connected!');
  }
};

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('open', function open() {
    wss.renderMessage('Connected sockets count: ' + wss.clients.length);
    ws.uid = md5sum.digest('hex');
    dataJson = JSON.stringify({event:'message', data: { message: 'You are connected to server!' }});
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(dataJson);
    }
    return true;
  });

  ws.on('message', function incoming(data) {
    wss.renderMessage('Received data: ' + data);
    dataObj = JSON.parse(data);
    if (typeof dataObj.from !== 'undefined' && typeof dataObj.to !== 'undefined') {
       switch(dataObj.to){
        case 'all':
          wss.broadcast(dataObj);
          break;
        case 'server':
          wss.receiveServerRequest(ws, dataObj);
          break;
        default:
          wss.broadcastByClientName(dataObj.to, dataObj);
      }
    } else {
      wss.renderMessage('Undefined client!');
    }
    return true;
  });

  ws.on('close', function close() {
    wss.renderMessage('Client disconected: ' + ws.client);
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping('', false, true);
    });
  }, 3000000);
});
