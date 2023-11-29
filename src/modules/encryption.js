import CryptoJS from "crypto-js";

export function encryptData(data) {
  return CryptoJS.AES.encrypt(data, "Kemang_28").toString();
}

export function decryptData(data) {
  return CryptoJS.AES.decrypt(data, "Kemang_28").toString(CryptoJS.enc.Utf8);
}
