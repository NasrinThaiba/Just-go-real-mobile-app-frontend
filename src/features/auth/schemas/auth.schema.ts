export function validatePhone( phone:string ){
    return ( phone.length === 10 && /^\d+$/.test(phone) );
    }

export function validateOtp(otp:string ){
    return ( /^\d{6}$/.test(otp));
    }