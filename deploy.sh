#!/bin/bash

# 易宿酒店平台部署脚本

cd /opt/yisu-hotel-platform

# 创建后端 Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
EOF

# 构建并启动后端
cd backend
docker build -t yisu-backend .
docker run -d --name yisu-backend -p 3001:3001 yisu-backend

# 构建商户端
cd ../frontend-merchant
docker run --rm -v "$PWD":/app -w /app node:18-alpine sh -c "npm install && npm run build"

# 启动商户端静态服务
docker run -d --name yisu-merchant -p 5175:5175 -v "$PWD/dist":/app -w /app node:18-alpine npx serve -l 5175

# 构建用户端
cd ../frontend-user
docker run --rm -v "$PWD":/app -w /app node:18-alpine sh -c "npm install && npm run build"

# 启动用户端静态服务
docker run -d --name yisu-user -p 5176:5176 -v "$PWD/dist":/app -w /app node:18-alpine npx serve -l 5176

echo "部署完成！"
echo "后端: http://58.87.99.218:3001"
echo "商户端: http://58.87.99.218:5175"
echo "用户端: http://58.87.99.218:5176"
