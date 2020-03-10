const fs = require('fs');
const xml2js = require('xml2js');
const make3DArray = require('./common');

// const n = 20; // Dimension of the square "world" MAX 30
// const t = 3; // Number of distinct species MAX 3
// const i = 500; // Number of iterations to be calculated </world> MAX 1000

const parseXML = path => {
  const parser = new xml2js.Parser();
  fs.readFile(path, function(err, data) {
    if (err) throw err;

    parser.parseString(data, function(err, result) {
      if (err) throw err;

      initializeGame(result);
      console.log('The XML file has been imported');
    });
  });
};

parseXML('../bin/game-of-life-setup.xml');

const initializeGame = xml => {
  console.log(xml.life.world);
  const n = Number(xml.life.world[0].cells[0]);
  const t = Number(xml.life.world[0].species[0]);
  const i = Number(xml.life.world[0].iterations[0]);

  console.log('HEREX', n, t, i);
};
