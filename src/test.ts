//test real payments
import dotenv from 'dotenv';// This is for loading environment variables from a .env file into process.env, allowing you to access sensitive information like API keys and secrets without hardcoding them into your codebase.
import {MpesaService} from './services/mpesa';//This is for importing the MpesaService class from the mpesa.ts file located in the services directory. This service class is responsible for handling interactions with the M-Pesa API, such as initiating payments and checking payment statuses.
dotenv.config();// This line initializes the dotenv package, which reads the .env file and loads the environment variables into process.env. This is typically done at the very beginning of your application to ensure that all subsequent code has access to the necessary configuration values.



async function testPayment(){
    console.log('Starting payment test...');
    const mpesaService = new MpesaService();
    try{const result = await mpesaService.initiateSTKPush('255747027638', 100); console.log("Mpesa Reponse",result); console.log('Check your phone for your payment prompt!');}  
    catch(error){console.error('Test failed:', error instanceof Error ? error.message : 'An unknown error occurred');}
}

testPayment();//This is calling the testPayment function, which initiates a test payment using the M-Pesa service. It will log the response from the M-Pesa API and prompt the user to check their phone for the payment confirmation.