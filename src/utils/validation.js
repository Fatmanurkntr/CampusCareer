// src/utils/validation.js

// E-posta formatı doğru mu? (örn: @isareti var mı, .com var mı)
export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

// Şifre en az 6 karakter mi?
export const validatePassword = (password) => {
    return password && password.length >= 6;
};