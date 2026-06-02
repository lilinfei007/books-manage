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

router.put('/update/:_id',async (req:Request,res:Response) => {
  let _id = req.params._id;
  if(!_id) return res.json({
    status:1,
    message:"_id不能为空"
  });
  // console.log(zBooksSchema.partial);
  const partialBooks = zBooksSchema.partial();
  const result = partialBooks.safeParse(req.body);
  if(!result.success){
    throw new Error(result.error.issues[0]!.message);
  }
  try{
    await BooksModel.updateOne({_id},result.data)
    res.json({
      status:0,
      message:"更新成功"
    });
  }catch(e){
    throw e;
  }
})  

router.get("/list",async (req:Request,res:Response) => { 
  try{
    const {name = "",author = "",type = "",page = "1",pageSize = "10"} = req.query;
    const matchCondition: Record<string,any> = {};
    if(name){
      matchCondition.name = new RegExp(<string>name);
    }

    if(author){
      matchCondition.author = new RegExp(<string>author);
    }

    if(type){
      matchCondition.type = new mongoose.Types.ObjectId(<string>type);
    }
    let list = await BooksModel.aggregate([{
      $match:matchCondition,
    },{
      $project:{
        __v:0
      }
    },{
      $sort:{
        created_time:-1
      }
    },{
      $facet:{
        "list":[
          {$skip:parseInt(<string>page) * parseInt(<string>pageSize) - parseInt(<string>pageSize)},
          {$limit:parseInt(<string>pageSize)},
        ],
        "count":[{
          $count:"count"
        }]
      }
    },{
      $project:{
        list:1,
        total:{
          $ifNull:[{$arrayElemAt:["$count.count",0]},0]
        }
      }
    }]);
    res.json({
      status:0,
      data:{
        list:list[0].list,
        page:parseInt(<string>page),
        pageSize:parseInt(<string>pageSize),
        total:list[0].total
      }
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