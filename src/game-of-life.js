const fs = require('fs');
const xml2js = require('xml2js');
const colors = require('colors');
const { make3DArray, gridToXml } = require('./common');

// Properties:
// n → Dimension of the square "world"
// t → Number of distinct species
// i → Number of iterations to be calculated

const gameOfLife = (initPath, finalPath) => {
  const parseXML = path => {
    const parser = new xml2js.Parser();
    fs.readFile(path, (err, data) => {
      if (err) throw err;

      parser.parseString(data, (err, result) => {
        if (err) throw err;
        console.log(colors.green('The XML file has been imported'));

        initializeGame(result);
      });
    });
  };

  parseXML(initPath);

  const deduplicate = (grid, n, t) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j].indexOf(1) !== grid[i][j].lastIndexOf(1)) {
          let counter = 0;
          let indexTrue = [];

          grid[i][j].forEach((species, k) => {
            if (species === 1) {
              counter++;
              indexTrue.push(k);
            }
          });

          const selectSpecies = Math.floor(Math.random() * counter);

          for (let k = 0; k < t; k++) {
            k === selectSpecies ? (grid[i][j][k] = 1) : (grid[i][j][k] = 0);
          }
        }
      }
    }
  };

  const initializeGame = xml => {
    const n = Number(xml.life.world[0].cells[0]);
    const t = Number(xml.life.world[0].species[0]);
    const i = Number(xml.life.world[0].iterations[0]);

    let grid = make3DArray(n, t);

    xml.life.organisms[0].organism.map(organism => {
      grid[organism.x_pos[0]][organism.y_pos[0]][organism.species[0]] = 1;
    });

    if (t > 1) {
      deduplicate(grid, n, t);
    }

    computeNextIterations(grid, n, t, i);
  };

  const countNeighbors = (grid, x, y, n) => {
    let count = [];

    grid[x][y].forEach((s, k) => (count[k] = 0));

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + n) % n;
        let row = (y + j + n) % n;

        grid[col][row].forEach((species, k) => {
          count[k] += species === 1 && 1;
        });
      }
    }

    grid[x][y].forEach((species, k) => {
      count[k] -= species === 1 && 1;
    });

    return count;
  };

  const computeNextIteration = (grid, n, t) => {
    const next = make3DArray(n);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const neighbors = countNeighbors(grid, i, j, n);
        const numberOfNeighbors = neighbors.reduce((sum, val) => sum + val, 0);

        if (grid[i][j].indexOf(1) === -1 && numberOfNeighbors === 3) {
          let selectSpecies = [];

          if (neighbors.indexOf(2) !== -1) {
            selectSpecies = neighbors.indexOf(2);
          } else if (neighbors.indexOf(3) !== -1) {
            selectSpecies = neighbors.indexOf(3);
          } else {
            let counter = 0;
            let indexTrue = [];

            neighbors.forEach((species, k) => {
              if (species === 1) {
                indexTrue.push(k);
                counter++;
              }
            });

            selectSpecies = Math.floor(Math.random() * counter);
          }

          for (let k = 0; k < t; k++) {
            k === selectSpecies ? (next[i][j][k] = 1) : (next[i][j][k] = 0);
          }
        } else if (
          grid[i][j].indexOf(1) !== -1 &&
          (numberOfNeighbors < 2 || numberOfNeighbors > 3)
        ) {
          grid[i][j].forEach((species, k) => (next[i][j][k] = 0));
        } else {
          next[i][j] = grid[i][j];
        }
      }
    }

    grid = next;

    if (t > 1) {
      deduplicate(grid, n, t);
    }

    return grid;
  };

  const computeNextIterations = (grid, n, t, i) => {
    for (let l = 0; l < i; l++) {
      grid = computeNextIteration(grid, n, t);
    }

    gridToXml(grid, n, t, i, finalPath);
  };
};

module.exports = gameOfLife;
