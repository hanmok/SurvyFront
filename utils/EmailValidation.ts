export default function isValidEmail(email: string) {
    // 이메일 유효성을 검사하는 정규 표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 정규 표현식을 사용하여 이메일 유효성 검사
    return emailRegex.test(email);
}
