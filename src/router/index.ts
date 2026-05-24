import express from 'express';
import book from './books.js';
export default function(app: express.Application){
  app.use('/books',book);
}