const cryptObj = window.crypto || (window as any).msCrypto;
if (!cryptObj) {
  console.error('Environment does not support the Web Cryptography API.');
}

export default cryptObj;
