const fs = require('fs');
const xml2js = require('xml2js');
const { make3DArray, gridToXml } = require('./common');

// const n = 20; // Dimension of the square "world" MAX 30
// const t = 3; // Number of distinct species MAX 3
// const i = 500; // Number of iterations to be calculated </world> MAX 1000

const gameOfLife = (initPath, finalPath) => {
  const parseXML = path => {
    const parser = new xml2js.Parser();
    fs.readFile(path, (err, data) => {
      if (err) throw err;

      parser.parseString(data, (err, result) => {
        if (err) throw err;
        console.log('The XML file has been imported');

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

  const countNeighbors = (grid, x, y, t, n) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + n) % n;
        let row = (y + j + n) % n;
        sum += grid[col][row].indexOf(1) !== -1 && 1;
      }
    }
    sum -= grid[x][y][t];

    return sum;
  };

  const computeNextIteration = (grid, n, t) => {
    const next = make3DArray(n);

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < t; k++) {
          const state = grid[i][j][k];

          const neighbors = countNeighbors(grid, i, j, k, n);

          if (state == 0 && neighbors == 3) {
            next[i][j][k] = 1;
          } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
            next[i][j][k] = 0;
          } else {
            next[i][j][k] = state;
          }
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
    // console.log('FINAL-GRID', grid);
  };
};

gameOfLife('../src/game-of-life-setup.xml', '../src/game-of-life-final.xml');
