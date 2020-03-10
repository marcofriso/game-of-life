const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const make3DArray = require('./common');

const setup = (n, t) => {
  let grid = make3DArray(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < t; k++) {
        let value = Math.random() >= 0.6;

        grid[i][j][k] = value;
      }
    }
  }

  return grid;
};

const organism = (x, y, t) =>
  `
    <organism>
      <x_pos>${x}</x_pos>
      <y_pos>${y}</y_pos>
      <species>${t}</species>
    </organism>`;

const organisms = grid => {
  const organismsAlive = [];

  grid.map((x, i) => {
    x.map((y, j) => {
      y.map((t, k) => {
        t && organismsAlive.push(organism(i, j, k));
      });
    });
  });

  return organismsAlive.join('');
};

const xmlBodyStr = (n, t, i) => {
  let grid = setup(n, t);
  return `<?xml version="1.0" encoding="UTF­8"?>
<life>
  <world>
    <cells>${n}</cells>
    <species>${t}</species>
    <iterations>${i}</iterations>
  </world>
  <organisms>${organisms(grid)}
  </organisms>
</life>
`;
};

const xmlDoc = (n, t, i) => {
  const xmlBody = xmlBodyStr(n, t, i);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlBody, 'text/xml');
  fs.writeFile('game-of-life-setup.xml', xmlDoc, function(err) {
    if (err) {
      throw err;
    } else {
      console.log('setup file `game-of-life-setup.xml` has ben created');
    }
  });

  return xmlDoc;
};

module.exports = xmlDoc;
