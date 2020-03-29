const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const colors = require('colors');

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

const gridToXml = (grid, n, t, i, path) => {
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

  const xmlBodyStr = (grid, n, t, i) =>
    `<?xml version="1.0" encoding="UTF­8"?>
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

  const xmlDoc = (n, t, i) => {
    const xmlBody = xmlBodyStr(grid, n, t, i);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlBody, 'text/xml');
    fs.writeFile(path, xmlDoc, function(err) {
      if (err) {
        throw err;
      } else {
        console.log(colors.green.bold(`\nFile "${path}" has ben created`));
      }
    });

    return xmlDoc;
  };

  return xmlDoc(n, t, i);
};

module.exports = { make3DArray, gridToXml };
