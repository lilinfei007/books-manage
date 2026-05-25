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
const router:Router = express.Router();
router.post("/delete",async (req:Request,res:Response) => { 
  let _id = req.body._id;
  if(!_id) return res.json({
    status:1,
    message:"_id不能为空"
  });
  try{
    await TypeModel.deleteOne({_id});
    res.json({
      status:0,
      message:"删除成功"
    });
  }catch(e){
    console.log(e);
  }
})
router.post("/add",async (req,res) => {
  if(!req.body.name) return res.json({
    status:1,
    message:"name不能为空"
  });
  const booksType = new TypeModel<TypeSchema>({
    name:req.body.name,
    created_time:new Date()
  });
  console.log(req.body)
  try{
    let createRes = await booksType.save();
    console.log(createRes)
    res.json({
      status:0,
      data:{
        _id:createRes._id,
        name:createRes.name,
        created_time:createRes.created_time
      },
      message:"创建成功"
    });
  }catch(e){
    console.log(e);
  }
});
router.get("/list",async (req:Request,res:Response) => {
  let list: object[] = [];
  try{
    list = await TypeModel.find({},{__v:0}).sort({created_time:-1});
    res.json({
      status:0,
      data:list
    });
  }catch(e){
    console.log(e);
  }
});
export default router;