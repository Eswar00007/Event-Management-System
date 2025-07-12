function GenerateKey(){
    return Math.floor(1000 + Math.random() * 9000);
}

function GenerateOTP(length){
    return Math.floor(length + Math.random() * 900000);
}

function Check_OTP(otp){
    return otp == current.otp? true: false
}

