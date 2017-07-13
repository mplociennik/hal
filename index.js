var crypto = require('crypto');
var md5sum = crypto.createHash('md5');

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8083});
console.log('Server listening...');

function heartbeat() {
  this.isAlive = true;
}

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Broadcast by client type.
wss.broadcastByClientName = function broadcast(clientName, data) {
  wss.clients.forEach(function each(client) {
    if (client.client === clientName && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.move = function(ws, direction, state){
  dataJson = JSON.stringify({event:'move', data:{direction: direction, state: state}});
  wss.broadcastByClientName('robotMove', dataJson);
}

wss.protectHome = function(ws, state){
  dataJson = JSON.stringify({event:'protectHome', data:{state: state}});
  wss.broadcastByClientName('protectHome', dataJson);
}

wss.serveHalClient = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
      switch(dataObj.event){
        case 'init':
          ws.client = dataObj.client;
          dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
          ws.send(dataJson);
          break;
        case 'message':
          console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
          break;
        case 'move':
            wss.move(dataObj.data.direction, dataObj.data.state);
            break;
        case 'protectHome':
            console.log('Protect home request');
            wss.protectHome(dataObj.data.state);
            break;
      }    
  }else{
    console.log('Event is undefined: ', dataObj);
  }
};

wss.serveProtectHome = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        console.log('Protect home initialized!');
        break;
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
      case 'alarm':
        dataJson = {event:'protectHomeAlarm', data:{message:dataObj.data.message}};
        wss.br(dataObj.data.direction, dataObj.data.state);
          break;
      case 'protectHome':
          wss.protectHome(dataObj.data.state);
          break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  }          
};

wss.serveRobotMove = function(ws, dataObj){

};

wss.on('connection', function connection(ws) {
  ws.isAlive = true;

  ws.on('pong', heartbeat);

  ws.on('open', function open() {
    ws.uid = md5sum.digest('hex');
    console.log('Connected client: ', ws);
    console.log('socket uid: ', ws.uid);
    dataJson = JSON.stringify({event:'message', data: { message: 'You are connected to server!' }});
    ws.send(dataJson);
    return true;
  });

  ws.on('message', function incoming(data) {
    console.log('Received data: ', data);
    dataObj = JSON.parse(data);
    if (typeof dataObj.client !== 'undefined') {
      switch(dataObj.client){
        case 'halClient':
          wss.serveHalClient(ws, dataObj);
          break;        
        case 'homeProtect':
          wss.serveProtectHome(ws, dataObj);
          break;        
        case 'robotMove':
          wss.serveRobotMove(ws, dataObj);
          break;
      }
    } else {
      console.log('Undefined client!');
    }
    
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
    return true;
  });

  ws.on('close', function close() {
    console.log('Client disconected: ', ws.client);
  });

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping('', false, true);
    });
  }, 30000);
});