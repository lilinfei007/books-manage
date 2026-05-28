import express,{ Router,Request,Response } from 'express';
import * as z from 'zod';
import booksType from './booksType.js';
const router: Router = express.Router();
router.use("/type",booksType);
router.post("/add",async(req: Request,res: Response) => {
  const User = z.object({
    name:z.string()
  });
  const input = {};
  try{

  const data = User.safeParse(input);
  console.log(data.error!.issues);
  }catch(e){
    if(e instanceof z.ZodError){
      // console.log(e.issues);
    }
  }
  res.json({
    status:0,
    message:"添加成功"
  });
});
router.get("/test",(req:Request,res: Response): void => {
  res.json({
    status:0
  });
});
export default router;