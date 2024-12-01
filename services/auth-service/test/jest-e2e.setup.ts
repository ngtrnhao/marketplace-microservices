import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Biến global để lưu instance của MongoDB Memory Server
let mongod: MongoMemoryServer;

// Chạy trước tất cả các test
beforeAll(async () => {
  // Khởi tạo MongoDB Memory Server
  mongod = await MongoMemoryServer.create();

  // Lấy URI kết nối
  const uri = mongod.getUri();

  // Kết nối Mongoose với MongoDB Memory Server
  await mongoose.connect(uri);
});

// Chạy sau khi tất cả test hoàn thành
afterAll(async () => {
  // Ngắt kết nối database
  await mongoose.disconnect();

  // Dừng MongoDB Memory Server
  await mongod.stop();
});

// Chạy sau mỗi test case
afterEach(async () => {
  // Lấy tất cả collections trong database
  const collections = mongoose.connection.collections;

  // Xóa toàn bộ dữ liệu trong mỗi collection
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({}); // Xóa sạch dữ liệu
  }
});
