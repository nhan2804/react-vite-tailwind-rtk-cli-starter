export const chunkMap = (arr, chunkSize, func) => {
  var chunks = [],
    i = 0,
    n = arr.length;

  while (i < n) {
    chunks.push(func(arr.slice(i, (i += chunkSize)), Math.floor(i / chunkSize)));
  }

  return chunks;
};
