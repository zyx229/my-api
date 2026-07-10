export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const data = req.body;
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
    res.status(200).json({ status: 'success', received: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
