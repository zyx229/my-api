const http = require('http');

function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        data: data
      };
      console.log(JSON.stringify(logEntry));

      if (data.action === 'patch') {
        console.log(`[PATCH] Player: ${data.targetPlayer}, Var: ${data.variable}, Value: ${data.value}`);
      } else if (data.action === 'scan_success') {
        console.log(`[SCAN] Found ${data.instanceCount} instances`);
      } else if (data.action === 'scan_failed') {
        console.log(`[SCAN] Failed: ${data.reason}`);
      } else if (data.action === 'heartbeat') {
        console.log(`[HEARTBEAT] ${data.playerName} (${data.playerId})`);
      } else if (data.action === 'config_dump') {
        console.log(`[DUMP] Player: ${data.playerName}, Config:`, data.config);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'success', received: true }));
    } catch (error) {
      console.error('Error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

const port = process.env.PORT || 8080;
const server = http.createServer(handler);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
