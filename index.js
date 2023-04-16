
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import connect from './database/connection.js';

import goldRateRout from './routes/goldRoutes.js';
import userRout from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.disable('x-powered-by') //less hackers know about our stack





app.use('/gold', goldRateRout);
app.use('/users', userRout);


/** start server only when we have valid connection */
connect().then(() => {
  try {
      app.listen(PORT, () => {
          console.log(`Server connected to http://localhost:${PORT}`);
      })
  } catch (error) {
      console.log('Cannot connect to the server')
  }
}).catch(error => {
  console.log("Invalid database connection...!");
})

