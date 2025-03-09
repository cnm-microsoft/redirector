const { createClient } = require('@vercel/kv');

// 初始化 Vercel KV 存储客户端
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async (req, res) => {
  // 验证请求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 验证密钥（可选，但推荐）
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { pattern, target } = req.body;
    
    // 验证必要的参数
    if (!pattern || !target) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // 获取当前重定向映射
    let redirectMap = await kv.get('redirectMap') || {};
    
    // 更新重定向规则
    redirectMap[pattern] = target;
    
    // 保存更新后的映射
    await kv.set('redirectMap', redirectMap);
    
    // 返回成功响应
    return res.status(200).json({ success: true, message: 'Redirect rule updated' });
  } catch (error) {
    console.error('Error updating redirect rules:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
