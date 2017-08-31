var moment = require('moment');
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8083});
console.log('Server listening...');

function heartbeat() {
  this.isAlive = true;
}

wss.getClientByType = function(clientType){
  var client = null;
  wss.clients.forEach(function each(item){
    if (item.client === clientType) {
      client = item;
    }
  });
  return client;
};

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
  state = false;
  wss.clients.forEach(function each(client) {
    if (client.client === clientName && client.readyState === WebSocket.OPEN) {
      state = true;
      client.send(data);
    }
  });
  return state;
};

wss.move = function(ws, direction, state){
  dataJson = JSON.stringify({event:'move', data:{direction: direction, state: state}});
  console.log('move dataJson: ', dataJson);
  wss.broadcastByClientName('robotMove', dataJson);
}

wss.protectHome = function(ws, state){
  console.log("Protect home request state: ", state);
  dataJson = JSON.stringify({event:'protectHome', data:{state: state}});
  wss.broadcastByClientName('protectHome', dataJson);
}

wss.autopilot = function(ws, state){
  console.log("Autopilot request state: ", state);
  dataJson = JSON.stringify({event:'autopilot', data:{state: state}});
  wss.broadcastByClientName('autopilot', dataJson);
}

wss.getRobotCameraImage = function(ws){
  dataJson = JSON.stringify({event:'photo', data:{}});
  wss.broadcastByClientName('robotCamera', dataJson);
}

wss.toggleKitchenLight = function(ws, state){
  console.log("KitchenLight request state: ", state);
  dataJson = JSON.stringify({event:'toggleKitchenLight', data:{state: state}});
  wss.broadcastByClientName('kitchenLight', dataJson);
}

wss.robotSpeechText = function(ws, text){
  console.log("robotSpeech request text: ", text);
  dataJson = JSON.stringify({event:'speech', data:{text: text}});
  wss.broadcastByClientName('robotSpeech', dataJson);
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
            wss.move(ws, dataObj.data.direction, dataObj.data.state);
            break;
        case 'protectHome':
            wss.protectHome(ws, dataObj.data.state);
            break;        
        case 'autopilot':
            wss.autopilot(ws, dataObj.data.state);
            break;        
        case 'getRobotCameraImage':
            wss.getRobotCameraImage(ws);
            break;        
        case 'toggleKitchenLight':
            wss.toggleKitchenLight(ws, dataObj.data.state);
            break;        
        case 'robotSpeechText':
            wss.robotSpeechText(ws, dataObj.data.text);
            break;
      }    
  }else{
    console.log('Event is undefined: ', dataObj);
  }
};

wss.serveAutopilot = function(ws, dataObj){
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
        break;
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
      case 'alarm':
        dataJson = JSON.stringify({event:'protectHomeAlarm', data:{message:dataObj.data.message}});
        wss.broadcastByClientName('halClient', dataJson);
        break;
      default:
        console.log('Event not found!');
        break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  }          
};

wss.serveRobotMove = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        console.log('RobotMove initialized!');
        break;
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  } 
};

wss.serveRobotCamera = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        console.log('RobotCamera initialized!');
        break;
      case 'stream_photo':
        dataJson = JSON.stringify({event:'stream_photo', data: dataObj.data});
        wss.broadcastByClientName('halClient', dataJson);
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  } 
};

wss.serveKitchenLight = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        console.log('KitchenLight initialized!');
        break;
      case 'toggle_kitchen_light':
        dataJson = JSON.stringify({event:'toggle_kitchen_light', data: dataObj.data});
        wss.broadcastByClientName('kitchenLight', dataJson);
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  } 
};

wss.serveRobotSpeech = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        console.log('robotSpeech initialized!');
        break;
      case 'speech':
        dataJson = JSON.stringify({event:'speech', data: dataObj.data});
        wss.broadcastByClientName('robotSpeech', dataJson);
      case 'message':
        console.log('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
    }    
  }else{
    console.log('Event is undefined: ', dataObj);
  } 
};

wss.serveRobotHardware = function(ws, dataObj){
  if (typeof dataObj.event !== 'undefined') {
    switch(dataObj.event){
      case 'init':
        ws.client = dataObj.client;
        dataJson = JSON.stringify({event:'message', data:{message: 'Init ready!'}});
        ws.send(dataJson);
        wss.renderMessage('robotHardware initialized!');
        break;
      case 'message':
        wss.renderMessage('Message from "' + dataObj.client + '": ' + dataObj.data.message);
        break;
    }    
  }else{
    wss.renderMessage('Event is undefined: ' + dataObj);
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
    if (typeof dataObj.client !== 'undefined') {
      switch(dataObj.client){
        case 'halClient':
          wss.serveHalClient(ws, dataObj);
          break;        
        case 'protectHome':
          wss.serveProtectHome(ws, dataObj);
          break;   
        case 'robotMove':
          wss.serveRobotMove(ws, dataObj);
          break;
        case 'autopilot':
          wss.serveAutopilot(ws, dataObj);
          break;             
        case 'robotCamera':
          wss.serveRobotCamera(ws, dataObj);
          break;   
        case 'kitchenLight':
          wss.serveKitchenLight(ws, dataObj);
          break;     
        case 'robotSpeech':
          wss.serveRobotSpeech(ws, dataObj);
          break;            
        case 'robotHardware':
          wss.serveRobotHardware(ws, dataObj);
          break;        
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

wss.renderMessage = function(message){
  console.log('**********************************************');
  console.log(moment().format() + ": " + message)
  console.log('**********************************************');
  return true;
}