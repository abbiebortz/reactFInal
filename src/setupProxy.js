const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Assuming all routes starting with '/api' should be proxied
    createProxyMiddleware({
      target: 'http://localhost:5001', // Update this to your actual server's URL and port
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Optionally rewrite path
      },
      secure: false,
    })
  );
};

