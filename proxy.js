const http = require('http');
const httpProxy = require('http-proxy');

let requestCount = 0;

const proxy = httpProxy.createProxyServer({
  target: 'https://mainnet.infura.io',
  changeOrigin: true,
  ssl: {
    rejectUnauthorized: false 
  }
});

proxy.on('error', function (error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  console.error(error);
});

const server = http.createServer(function(req, res) {
  requestCount++;
  console.log(`Request number ${requestCount}`);

  proxy.web(req, res);
});

console.log("Proxy server listening on port 5050");
server.listen(5050);
