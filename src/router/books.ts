import express,{ Router,Request,Response } from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import * as z from 'zod';
import booksType from './booksType.js';
const router: Router = express.Router();
router.use("/type",booksType);
const booksSchema = new Schema({
  name: String,
  author: String,
  type: {
    type:Schema.Types.ObjectId,
    ref:'type',
    required:true
  },
  create_time:{
    type:Date,
    default:Date.now
  }
});

const BooksModel = mongoose.model('books', booksSchema);

const zBooksSchema = z.object({
  name: z.string("name为字符串").min(1,"name不能为空"),
  author: z.string("author为字符串").min(1,"author不能为空"),
  type: z.string("type为字符串").min(1,"type不能为空")
})

router.delete("/delete/:_id",async (req:Request,res:Response) => {
  if(!req.params._id){
    return res.json({
      status:1,
      message:"_id不能为空"
    });
  }
  try{
    await BooksModel.findByIdAndDelete(req.params._id);
    res.json({
      status:0,
      message:"删除成功"
    });
  }catch(e){
    throw e;
  }
});

router.get("/list",async (req:Request,res:Response) => { 
  try{
    let list = await BooksModel.find({},{__v:0}).lean();
    res.json({
      status:0,
      data:list
    });
  }catch(e){
    throw e;
  }
});
router.post("/add",async(req: Request,res: Response) => {
  const result = zBooksSchema.safeParse(req.body);
  if(!result.success){
    throw new Error(result.error.issues[0]!.message);
  }
  try{
  const doc = await new BooksModel({...result.data});
  console.log(doc)
  await doc.save();
  res.json({
    status:0,
    message:"添加成功"
  });
  }catch(e){
    throw e;
  }
});
router.get("/test",(req:Request,res: Response): void => {
  res.json({
    status:0
  });
});
export default router;