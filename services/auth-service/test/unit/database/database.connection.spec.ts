import { MongoMemoryServer } from 'mongodb-memory-server'; // Thư viện tạo MongoDB giả lập trong memory
import mongoose from 'mongoose'; // ODM để tương tác với MongoDB

describe('Database Connection', () => {
  // Khai báo biến để lưu instance của MongoDB Memory Server
  let mongod: MongoMemoryServer;

  // Setup trước khi chạy tất cả test cases
  beforeAll(async () => {
    // Tăng timeout lên 60s vì việc khởi tạo MongoDB Memory Server có thể mất thời gian
    jest.setTimeout(60000);

    // Khởi tạo MongoDB Memory Server
    // Đây là một instance MongoDB chạy trong memory, không cần cài đặt MongoDB thật
    mongod = await MongoMemoryServer.create();
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Test case: kiểm tra kết nối thành công
  it('should connect to mongodb', async () => {
    // Lấy URI kết nối từ MongoDB Memory Server
    const uri = mongod.getUri();

    // Ngắt kết nối hiện tại (nếu có)
    await mongoose.disconnect();

    // Thử kết nối với URI mới
    await mongoose.connect(uri);

    // Kiểm tra trạng thái kết nối
    // readyState = 1 nghĩa là đã kết nối thành công
    // Các giá trị khác:
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    expect(mongoose.connection.readyState).toBe(1);
  }, 60000);

  // Test case: kiểm tra xử lý lỗi kết nối
  it('should handle connection errors', async () => {
    // Tạo một URI không hợp lệ
    const invalidUri =
      'mongodb+srv://invalid:wrong@non-existent-cluster.mongodb.net/?retryWrites=true&w=majority';

    // Ngắt kết nối hiện tại
    await mongoose.disconnect();

    // Kiểm tra việc kết nối với URI không hợp lệ có throw error không
    await expect(mongoose.connect(invalidUri)).rejects.toThrow();
  }, 60000);

  // Dọn dẹp sau khi chạy tất cả test cases
  afterAll(async () => {
    // Ngắt kết nối database
    await mongoose.disconnect();

    // Dừng MongoDB Memory Server
    // Điều này sẽ giải phóng tài nguyên và xóa dữ liệu trong memory
    await mongod.stop();
  }, 60000);
});
