// pages/api/update-redirect.js
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

// 内存存储（生产环境应替换为数据库）
const redirects = new Map();

export default withIronSessionApiRoute(async (req, res) => {
  // 1. 安全验证
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  if (!req.session.user) return res.status(401).send('Unauthorized');

  // 2. 解析请求参数
  const { domain, port, path, target } = req.body;
  const key = `${domain}:${port}${path}`;
  
  // 3. 更新/删除规则
  if (target) {
    redirects.set(key, target);
    res.status(200).json({ success: true });
  } else {
    redirects.delete(key);
    res.status(200).json({ success: true, deleted: true });
  }
}, sessionOptions);
