#!/bin/sh

# 启动后端服务
cd /app/backend
node server.js &

# 启动商户端（静态文件）
cd /app/frontend-merchant/dist
serve -l 5175 &

# 启动用户端（静态文件）
cd /app/frontend-user/dist
serve -l 5176 &

# 保持容器运行
tail -f /dev/null
