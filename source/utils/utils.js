export function generate4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
export function currDate() {
    return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
}
// encrypt and decrypt
const secretKey = process.env.CRYPTO_KEY 
export function encrypt(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString()
}
export function decrypt(data) {
    var bytes  = CryptoJS.AES.decrypt(data, secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
}