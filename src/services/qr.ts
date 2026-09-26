import QRCode from 'qrcode';


//Service class for generating QR codes-->Will be called in the routes to generate QR codes for payments
export class QRService {
//Generate a QR code from a given text and return it as a data URL
    async generatePaymentQR(phone:string, amount:number, reference:string): Promise<string>{

        //Create string of text to encode in the QR
        const qrText = `lipa-na-mpesa://pay?phone=${phone}&amount=${amount}&ref=${reference}`;

        //Turn the string of text to QRImage
        const qrImage = await QRCode.toDataURL (qrText,{width:400, margin: 3, color:{dark: '#000000', light:'#ffffff'}})
    
        return qrImage;
    }
}