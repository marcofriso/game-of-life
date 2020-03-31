const { make3DArray, gridToXml } = require('./common');

const setup = (n, t) => {
  let grid = make3DArray(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < t; k++) {
        const value = Math.random() > 1 / (t * 2) ? 0 : 1;

        grid[i][j][k] = value;
      }
    }
  }

  return grid;
};

const setupFile = (n, t, i, initPath) => {
  const setupGrid = setup(n, t);

  return gridToXml(setupGrid, n, t, i, initPath);
};

module.exports = setupFile;
