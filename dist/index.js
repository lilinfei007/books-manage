import express from 'express';
import mountedRouter from './router/index.js';
const app = express();
mountedRouter(app);
console.log(1);
console.log(2);
console.log(3);
app.listen(3000);