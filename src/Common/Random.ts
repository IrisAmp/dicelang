let getRandomValues;
try {
  // tslint:disable-next-line:no-var-requires
  getRandomValues = require('get-random-values');
} catch (e) {
  console.error(new Error('Enviroment does not support the crypto API.'));
}

const buff = new ArrayBuffer(4);
export function getRandomNumber(): number {
  if (getRandomValues) {
    getRandomValues(new Uint8Array(buff));
    return new Uint32Array(buff)[0] / 4294967295;
  } else {
    return Math.random();
  }
}

export function getRandomInt(min: number, max: number): number {
  min = Math.round(min);
  max = Math.round(max);
  return Math.floor(getRandomNumber() * (max - min)) + min + 1;
}
