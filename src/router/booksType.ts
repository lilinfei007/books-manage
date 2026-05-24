import express,{ Router,Request,Response } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
interface TypeSchema {
  name:string;
  created_time:Date;
}

const typeSchema = new Schema<TypeSchema>({
  name:String,
  created_time:{
    type:Date,
    default:Date.now
  }
});
const TypeModel = mongoose.model('type',typeSchema);
// const TypeModel = mongoose.model('type');
const router:Router = express.Router();
router.post("/add",async (req,res) => {
  console.log(req.body)
  res.json({
    status:0,
    data:"OK"
  });
  // const booksType = new TypeModel<TypeSchema>({
  //   name:"1111",
  //   created_time:new Date()
  // });
  // await booksType.save();
  // res.json({
  //   status:0,
  //   data:"OK"
  // });
});
router.get("/list",(req:Request,res:Response) => {
  res.json({
    status:0,
    data:[]
  });
});
export default router;