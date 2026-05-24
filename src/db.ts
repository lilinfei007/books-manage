import mongoose from 'mongoose';
export async function connect(){
  mongoose.connect('mongodb://127.0.0.1:27017/books').then(() => {
    console.log('数据库连接成功');
  }).catch((err) => {
    console.log('数据库连接失败',err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB 断开连接...');
  });
}