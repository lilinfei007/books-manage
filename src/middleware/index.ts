import express,{ Request,Response,NextFunction,Errback } from 'express';
export default function(app: express.Application){
  app.use(express.json());
  app.use((err: any,req:Request,res:Response,next:NextFunction) => {
    res.status(200).json({
      status:1,
      message:err.message
    });
  })
}