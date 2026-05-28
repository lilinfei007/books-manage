import mongoose from 'mongoose';
export async function connect(){
  try{
    console.log("数据库连接中");
    await mongoose.connect('mongodb://127.0.0.1:27017/books');
    console.log("数据库连接成功");
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB 断开连接...');
    });
  }catch(e){
    console.log("数据库连接失败");
    console.log(e);
  }
}