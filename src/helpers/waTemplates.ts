
export const otpWaTemplate = (otp: string): string => {
    return `*${otp}* adalah kode verifikasi Anda. Demi keamanan, jangan bagikan kode ini.`;
}