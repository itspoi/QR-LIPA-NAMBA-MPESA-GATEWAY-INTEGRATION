//This is a formfo rthe customer to fill in their payment details and submit the payment request. It includes fields for the customer's phone number, the amount to be paid, and a reference for the payment. The form is submitted to the server to generate a QR code for the payment.

export interface PaymentRequest {phone:string; amount:number; reference:string;}

export interface PaymentResponse {success: boolean; transactionId: string; message :string; timestamp:Date;}

export interface QRPaymentRequest{phone:string; amount:number; reference:string;}

  