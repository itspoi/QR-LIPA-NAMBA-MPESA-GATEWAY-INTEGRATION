import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import qrRoutes from './routes/qr';
import paymentsRoutes from './routes/payments';
import {DatabaseService} from './services/database';
import {validatePayment} from './middleware/validation';

dotenv.config();

const app= express();
const db = new DatabaseService();
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/qr', qrRoutes);
app.use('/api/payments', paymentsRoutes);


//Health check
app.get('health', (req,res)=> {res.json({status: 'ok'});});


//Get all payments
app.get('/api/payments',(req, res) => {const payments = db.getAllPayments(); res.json({success: true, payments}); 
const PORT = process.env.PORT || 3000; app.listen(PORT, ()=> {console.log(`🚀Server runs on ${PORT}`)}); 
});