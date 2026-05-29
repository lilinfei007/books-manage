import express,{ Router,Request,Response } from 'express';
import * as z from 'zod';
import booksType from './booksType.js';
const router: Router = express.Router();
router.use("/type",booksType);
router.post("/add",async(req: Request,res: Response) => {
const {title,type,author,publisher,publishTime,price,pageNum,introduction,cover} = req.body;
  const numberWithCatch = z.number().catch(30);
  const result = numberWithCatch.safeParse("1");
  console.log(result);
  // type PlayerType = z.infer<typeof Player>
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