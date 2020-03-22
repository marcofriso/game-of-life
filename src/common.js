const make3DArray = (n, t) => {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      arr[i][j] = new Array(t);
      for (let k = 0; k < t; k++) {
        arr[i][j][k] = 0;
      }
    }
  }
  return arr;
};

module.exports = make3DArray;
