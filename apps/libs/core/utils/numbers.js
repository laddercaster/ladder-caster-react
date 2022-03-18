export const randomIntBetween = (start, end) => {
  return Math.floor(Math.random() * (end - start + 0.99) + start);
};

export const LEVEL_BOUNDS = [
  1,
  228,
  411,
  639,
  912,
  1231,
  1596,
  2006,
  2461,
  2962,
  3509,
  4101,
  4738,
  5421,
  6150,
  6924,
  7743,
  8608,
  9519,
  10475,
  11476,
  12523,
  13616,
  14754,
  15937,
  17166,
  18441,
  19761,
  21126,
  22537,
];

export const convertStrToRandom = (str, max) => {
  const data = atob(str);
  const array = Uint8Array.from(data, (b) => b.charCodeAt(0));
  const length = array.length;
  let buffer = Buffer.from(array);
  const result = buffer.readUIntBE(0, length);
  return (+`${result.toString().split('.')?.[1]}`.substr(0, 8) / 10e7) * max;
};
