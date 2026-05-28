import express,{ Router,Request,Response,NextFunction } from 'express';
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

const formatDate = (date: Date): string => {
  const pad = (value: number): string => String(value).padStart(2,'0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

interface Validator {
  required:boolean;
  type:"string" | "number" | "object" | "boolean" | "array" | "date" | "buffer" | "mixed" | "objectid" | "string[]" | "number[]" | "object[]" | "boolean[]" | "array[]" | "date[]" | "buffer[]" | "mixed[]" | "objectid[]" | "any[]" | "any" | "string|number" | "string|object" | "string|boolean" | "string|array" | "string|date";
}

interface ModifyValidator extends Record<string, Validator> {
  _id:Validator;
  name:Validator;
}

const validatorHandle = <T extends Record<string,Validator>>(validtor: T) => {
  return (req:Request,res:Response,next:NextFunction) => {
    for(const [key,value] of Object.entries(validtor)){
      if(value.required){
        if(!(key in req.body)){
          return res.json({
            status:1,
            message:`${key}为必传项`
          });
        }
        let type = value.type;
        if(type === "number" && !value && value != 0){
          return res.json({
            status:1,
            message:`${key}不能为空`
          });
        }else if(type === 'boolean'){
          if(typeof  value !== type){
            return res.json({
              status:1,
              message:`${key}必须是false或者true`
            });
          }
        }
      }
    }
    next();
  }
}
const modifyValidator:ModifyValidator = {
  _id:{
    required:true,
    type:"string"
  },
  name:{
    required:true,
    type:"string"
  }
}
const TypeModel = mongoose.model('type',typeSchema);
const router:Router = express.Router();
router.put("/modify",validatorHandle(modifyValidator),async (req:Request,res:Response) => {
  let _id = req.body._id;
  let name = req.body.name;
  try{
    let updateRes = await TypeModel.updateOne({_id},{name});
    res.json({
      status:0,
      message:"修改成功"
    });
  }catch(e){
    res.json({
      status:1,
      message:"修改失败"
    });
  }
})
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
  }catch(error){
    throw error;
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
  try{
    let createRes = await booksType.save();
    res.json({
      status:0,
      data:{
        _id:createRes._id,
        name:createRes.name,
        created_time:formatDate(createRes.created_time)
      },
      message:"创建成功"
    });
  }catch(error){
    throw error;
  }
});
router.get("/list",async (req:Request,res:Response) => {
  try{
    const list = await TypeModel.find({},{__v:0}).sort({created_time:-1}).lean();
    const data = list.map((item) => ({
      ...item,
      name:item.name || "",
      created_time:formatDate(item.created_time)
    }));
    res.json({
      status:0,
      data
    });
  }catch(error){
    throw error;
  }
});
export default router;
