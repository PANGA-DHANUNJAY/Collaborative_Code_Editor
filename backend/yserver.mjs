import http from 'http';
import { WebSocketServer } from 'ws';
import * as yWebSocketUtils from 'y-websocket/bin/utils.js'; // Import everything

const { setupWSConnection } = yWebSocketUtils; // Grab the function explicitly

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('okay');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req); // This will now work
});

const PORT = 1234;
const HOST = '0.0.0.0'; // This makes it accessible on your local network (or you can set a specific IP like '192.168.1.10')

server.listen(PORT, HOST, () => {
  console.log(`✅ Yjs WebSocket server is running at http://${HOST}:${PORT}`);
});

