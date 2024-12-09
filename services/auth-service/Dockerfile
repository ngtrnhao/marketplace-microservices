# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies cần thiết cho build
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt chỉ các dependencies cần thiết cho production
RUN npm install --only=production

# Sao chép mã nguồn đã build từ stage trước
COPY --from=builder /usr/src/app/dist ./dist

# Sao chép file .env.example và đổi tên thành .env
COPY .env.example .env

# Mở cổng 3001 để ứng dụng có thể truy cập từ bên ngoài
EXPOSE 3001

# Lệnh để chạy ứng dụng khi container khởi động
CMD ["node", "dist/main"]
