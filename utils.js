export function generate4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
export function currDate() {
    return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`
}