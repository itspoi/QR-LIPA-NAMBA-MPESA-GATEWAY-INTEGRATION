import express from 'express';
import {MpesaService} from '../services/mpesa';
import {QRService} from '../services/qr';
import {PaymentResponse} from '../types/payment';

// Router for handling payment-related routes
const router = express.Router();

// 
const mpesaService = new MpesaService();

// Route to initiate a payment
const qrService = new QRService(); // Assuming QRService is defined elsewhere

//POST /api/payments/initiate router
router.post(
    '/initiate', async(req, res)=>{
    // Extract the phone number, amount, and reference from the request body
    try{const {phone, amount, reference} = req.body;
        
        //Step 1: Generate a QR code for the payment using the QRService
        const qrCode = await qrService.generatePaymentQR(phone, amount, reference);
        
        //Step 2: Send STK Push request to M-Pesa API using the MpesaService
        const mpesaResponse = await mpesaService.initiateSTKPush(phone, amount);
        
        //Step 3: Return the QR code and M-Pesa response to the client
        res.status(200).json({success:true, qrCode:qrCode, message:'Payment QR generated successfully'});}
    
        // Catch any errors that occur during the payment initiation process
    catch(error: unknown){const message = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({success:false,message:'Payment Initiation failed', error:message})}}
    );


//POST /api/payments/callback router---> MPESA will call this endpoint to notify us of the payment status
//Callback --> Check ResultCode --> Update DB --> Notify User
router.post(
    '/callback',(req, res)=>{
    const callbackData = req.body;// Log the callback data for debugging purposes
    const resultCode = callbackData?.Body?.stkCallback?.ResultCode;
    if (resultCode===0){console.log('✅Payment was successful')}   else{console.log('❌Payment failed')}// Update the database with the payment status and details
    //Always respond with a 200 OK status to acknowledge receipt of the callback
    res.status(200).json({success:true, message:'Callback received successfully'})}
);

export default router;