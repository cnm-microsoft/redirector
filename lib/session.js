// lib/session.js
export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, // 从环境变量获取密钥
  cookieName: "redirector-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // 生产环境强制HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 // 24小时有效期
  },
};
