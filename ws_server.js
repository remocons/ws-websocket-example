import { readFileSync } from 'fs'
import { createServer } from 'http'
import { WebSocketServer } from 'ws';

const httpServer = createServer((req, res) => {


    console.log('req url:', req.url)
    if (req.url == '/') {
      let content2 = readFileSync('index.html');
      let length2 = Buffer.byteLength(content2);
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': length2
      });
      res.end(content2);
  
    } else {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
  
  
  });
  
  
  httpServer.listen(8080);

const wss = new WebSocketServer({ server: httpServer});


wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
  
    ws.on('message', function message(data , isBinary) {
        if(isBinary){
            console.log('byteLength', data.byteLength )
            console.log(data.toString('hex') )
            data[0] = 255
            ws.send( data )
        }else if( data == 'request_4bytes'){
            let buffer4 = Buffer.alloc(4)
            ws.send( buffer4)
        }else{
            console.log('received: %s', data);
            ws.send('echo: ' + data)
        }
    });
  
    ws.send('server is ready.');
  });


