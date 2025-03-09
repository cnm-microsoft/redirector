const { createClient } = require('@vercel/kv');

// 初始化 Vercel KV 存储客户端
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async (req, res) => {
  // 获取请求路径
  const path = req.url;
  
  try {
    // 从 KV 存储中获取重定向映射
    const redirectMap = await kv.get('redirectMap') || {};
    
    // 查找匹配的重定向目标
    let targetUrl = null;
    for (const [pattern, target] of Object.entries(redirectMap)) {
      if (new RegExp(pattern).test(path)) {
        targetUrl = path.replace(new RegExp(pattern), target);
        break;
      }
    }
    
    if (targetUrl) {
      // 执行重定向
      return res.redirect(301, targetUrl);
    } else {
      // 未找到匹配的重定向规则
      return res.status(404).send('Not found');
    }
  } catch (error) {
    console.error('Error fetching redirect rules:', error);
    return res.status(500).send('Internal server error');
  }
};
