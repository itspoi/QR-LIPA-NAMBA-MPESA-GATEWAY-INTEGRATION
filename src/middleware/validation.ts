import {Request, Response, NextFunction} from 'express';

export function validatePayment(req: Request, res: Response, next: NextFunction){const {phone, amount}=req.body;//This line extracts the phone and amount properties from the request body. It uses destructuring assignment to assign the values of these properties to the variables phone and amount, respectively.
    if(!phone|| !phone.match(/^255[67]\d{8}$/)){//This line checks if the phone variable is falsy (null, undefined, empty string, etc.) or if it does not match the regular expression pattern /^255[67]\d{8}$/. The regular expression pattern is used to validate that the phone number starts with '255', followed by either '6' or '7', and then followed by exactly 8 digits. If either condition is true (phone is invalid), the code inside the if block will be executed.
        return res.status(400).json({success:false,message:'Invalid phone number. Use format 2557'});
    }

    //Amount validation
    if(!amount || amount <=0){return res.status(400).json({success: false, message: 'Invalid amount. Must be greater than 0'});}

    //All good? continue
    next();
}

