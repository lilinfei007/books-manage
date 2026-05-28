import express,{ Request,Response,NextFunction,Errback } from 'express';
export default function(app: express.Application){
  app.use(express.json());
}