import express,{ Request,Response,NextFunction,Errback } from 'express';
import 'express-async-errors';
import mountedRouter from './router/index.ts';
import middleware from './middleware/index.ts';
import { connect } from './db.ts';
import { fileURLToPath } from 'url';
import {dirname} from 'path';
try{
  await connect();
  // console.log(dirname(fileURLToPath(import.meta.url)));
  // console.log(process.uptime())
  const app = express();
  middleware(app);
  mountedRouter(app);
  app.use((err: any,req:Request,res:Response,next:NextFunction) => {
    res.status(200).json({
      status:1,
      message:err.message
    });
  })
  const server = app.listen(3000,() => {
    console.log('server is running');
    console.log('http://localhost:3000');
  });
  server.on('error',(e) => {
    console.log(e);
  });
}catch(e){
  console.log(e)
}