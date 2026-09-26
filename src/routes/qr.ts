import express from 'express';

import {QRService} from '../services/qr';

const router = express.Router();

const qrService = new QRService();

//POST /api/qr/generate
router.post('/generate', async(req,res)=>{
    try{const{phone, amount, reference}=req.body;
    //GENERATE QR
    const qrCode = await qrService.generatePaymentQR(phone, amount, reference);
    // Send back to client
    res.json({success:true, qrCode:qrCode, info:{phone,amount,reference}});}


    catch(error){res.status(500).json({success:false,message:"Failed to generate qrCode"})}
});


export default router;//This line is for exporting the router object so that it can be used in other parts of the application, such as in the main server file where all routes are combined and the Express app is set up.




