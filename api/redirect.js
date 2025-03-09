module.exports = async (req, res) => {
  // 获取请求路径
  const path = req.url;
  
  // 从环境变量或数据库中获取重定向映射
  // 这里我们假设使用环境变量存储重定向规则
  const redirectMap = JSON.parse(process.env.REDIRECT_MAP || '{}');
  
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
};
