# 易宿酒店预订平台 - Docker 部署
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

FROM node:18-alpine AS merchant
WORKDIR /app/frontend-merchant
COPY frontend-merchant/package*.json ./
RUN npm install
COPY frontend-merchant/ ./
RUN npm run build

FROM node:18-alpine AS user
WORKDIR /app/frontend-user
COPY frontend-user/package*.json ./
RUN npm install
COPY frontend-user/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=merchant /app/frontend-merchant/dist ./frontend-merchant/dist
COPY --from=user /app/frontend-user/dist ./frontend-user/dist

# 安装 serve 用于静态文件服务
RUN npm install -g serve

# 暴露端口
EXPOSE 3001 5175 5176

# 启动脚本
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

CMD ["./docker-start.sh"]
