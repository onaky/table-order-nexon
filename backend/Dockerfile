FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json* ./
RUN npm install

# 소스 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# uploads 디렉토리 생성
RUN mkdir -p uploads

# 포트 노출
EXPOSE 3000

# 서버 시작
CMD ["node", "dist/server.js"]
