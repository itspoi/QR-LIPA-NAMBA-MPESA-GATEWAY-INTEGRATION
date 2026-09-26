import axios from 'axios';
import { PaymentResponse } from '../types/payment';




export class MpesaService {
    // This class is responsible for handling the communication with the M-Pesa API.
    // It will be used to initiate payments, check payment status, and handle any other interactions with the M-Pesa service.
    private consumerKey: string; private consumerSecret: string; private passkey: string; private shortcode: string; private baseUrl: string;
    //This constructor below constructor{} will initialize the class with the necessary credentials and configuration for interacting with the M-Pesa API. It will take in parameters such as the consumer key, consumer secret, passkey, shortcode, and base URL for the API endpoints. These values will be stored as private properties of the class for use in the various methods that will be implemented to handle the API interactions.
    constructor(){this.consumerKey = process.env.MPESA_CONSUMER_KEY || ''; this.consumerSecret = process.env.MPESA_CONSUMER_SECRET || ''; this.passkey = process.env.MPESA_PASSKEY||''; this.shortcode = process.env.MPESA_SHORTCODE||'174379'; this.baseUrl = process.env.MPESA_BASE_URL||'https://sandbox.safaricom.co.ke';}
    // The class will contain methods for each of the API endpoints that we need to interact with,
    // and will handle the necessary authentication and request formatting for those endpoints.
    // The class will also handle any errors that may occur during the API calls,
    // and will provide a consistent interface for the rest of the application to use when interacting with M-Pesa.

    // Fake for now
    // Draw this as a flowchart:
    // Start → Check amount → Process → Return result

    async processPayment(phone: string, amount: number): Promise<PaymentResponse> {
        console.log('Process Payment');
        console.log(`Phone: ${phone}`);
        console.log(`Amount: ${amount}`);

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1800));

        // Generate a fake transaction ID
        const transactionId = 'TXN' + Date.now();
        const message = `Payment processed successfully. For ${phone}, Tshs.${amount}`;

        // Return success
        return {
            success: true,
            transactionId: transactionId,
            message: message,
            timestamp: new Date(),
        }


        
    }
    // Step 1: Get that Access Token (like getting a visitor pass)
    //Key + Secret = Access Token=======>key + secret --> encode --> send --> receive token
    // Step 2: Use that Access Token to make the payment request to M-Pesa API
    // Step 3: Handle the response from M-Pesa API and return it to the caller
    async getAccessToken():Promise<string>{const auth=Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64'); const response=await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {headers: {'Authorization': `Basic${auth}`}}); return response.data.access_token;}     
    
    // Step 2: Send Payment Request (STK Push)
    // Draw: Token → Prepare Request → Send → Get Response
    async initiateSTKPush(phone: string, amount: number, ):Promise<PaymentResponse>{
        const token = await this.getAccessToken(); 
        const timestamp = new Date().toISOString(); 
        const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64')
        // Prepare the request
        const requestData = {Business: this.shortcode, Password: password, Timestamp: timestamp, TransactionType: 'CustomerPayBillOnline', Amount: amount, PartyA: phone, PartyB: this.shortcode, PhoneNumber: phone, CallBackURL: `${process.env.CALLBACK_URL}/api/payments/callback`, AccountReference: 'QR Payment', TransactionDesc: 'Payment via QR'};
        // Send to M-Pesa
        const response = await axios.post('food');
        return response.data;
    }
}
