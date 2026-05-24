import express,{ Router,Request,Response } from 'express';
import booksType from './booksType.js';
const router: Router = express.Router();
router.use("/type",booksType);
router.get("/test",(req:Request,res: Response): void => {
  res.json({
    status:0
  });
});
export default router;