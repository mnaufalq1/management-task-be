// 1. Fungsi Validasi Nama
export const validateName = (name) => {
    const cleanName = name.trim();
    if (cleanName.length < 3) {
        return { isValid: false, message: "Nama harus minimal 3 karakter." };
    }
    // Regex: Hanya huruf, spasi, petik tunggal, dan tanda hubung
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(cleanName)) {
        return { isValid: false, message: "Nama tidak boleh mengandung angka atau simbol acak." };
    }
    return { isValid: true, message: "Nama valid." };
};
// 2. Fungsi Validasi Password
export const validatePassword = (password) => {
    if (password.length < 8) {
        return { isValid: false, message: "Password minimal harus 8 karakter." };
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return {
            isValid: false,
            message: "Password terlalu sederhana! Harus kombinasi huruf besar, huruf kecil, angka, dan simbol."
        };
    }
    return { isValid: true, message: "Password kuat dan valid." };
};
//3. Fungsi Validasi Email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: "Email tidak valid." };
    }
    return { isValid: true, message: "Email valid." };
};
