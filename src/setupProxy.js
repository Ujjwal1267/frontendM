// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: process.env.REACT_APP_API_BASE_URL || "https://chat-boat-k23b.onrender.com",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onProxyRes: function(proxyRes) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      }
    })
  );
};
