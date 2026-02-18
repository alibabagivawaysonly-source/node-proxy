const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const TARGET = "https://liveeu-gcp.alkassdigital.net";

app.use("/live", createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: {
    "^/live": "",
  },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader("Referer", TARGET + "/");
    proxyReq.setHeader("Origin", TARGET);
  },
  onError: (err, req, res) => {
    console.error("Proxy Error:", err.message);
    res.status(500).send("Proxy Error: " + err.message);
  }
}));

app.get("/", (req, res) => {
  res.send("Proxy is running ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
