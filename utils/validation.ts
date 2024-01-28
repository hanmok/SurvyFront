export function isValidEmail(email: string) {
    // 이메일 유효성을 검사하는 정규 표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 정규 표현식을 사용하여 이메일 유효성 검사
    return emailRegex.test(email);
}

export function isValidPhone(phoneNumber: string) {
    // 010-9041-7421
    const phoneNumberPattern = /^\d{3}-\d{4}-\d{4}$/;
    return phoneNumberPattern.test(phoneNumber);
}
