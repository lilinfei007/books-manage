import express from 'express';
import mountedRouter from './router/index.js';
import middleware from './middleware/index.js';
import { connect } from './db.js';
connect();
const app = express();
middleware(app);
mountedRouter(app);
app.listen(3000);