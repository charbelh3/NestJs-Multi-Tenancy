import Cryptr from 'cryptr';

export function decrypt(encryptedData: string, encryptionKey: string): string {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.decrypt(encryptedData);
}
