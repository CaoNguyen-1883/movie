import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = 5000; 


app.use(cors());
app.use(express.json());





app.listen(port, ( ) => {
    console.log(`Server is running on port ${port}`);
});
