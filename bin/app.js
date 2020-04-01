#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const colors = require('colors');
const figlet = require('figlet');
const setupFile = require('../src/generator');
const gameOfLife = require('../src/game-of-life');

const title = colors.red(figlet.textSync('Game of Life').bold);

const questionsGenerator = [
  {
    type: 'list',
    name: 'squareDimension',
    message: 'Choose the square width',
    choices: [10, 20, 30, 40, 50],
    default: [20],
  },
  {
    type: 'list',
    name: 'species',
    message: 'Choose the number of species',
    choices: [1, 2, 3, 4, 5, 6],
    default: [1],
  },
  {
    type: 'number',
    name: 'iterations',
    message: 'Chooose the number of iterations (max: 2000)',
    validate: result => {
      if (result > 2000) {
        return 'Error: select maximum 2000 iterations';
      } else {
        return true;
      }
    },
    default: 500,
  },
];

const questionsGame = [
  {
    type: 'string',
    name: 'initialFile',
    message: 'Chooose the initial file',
    default: 'game-of-life-setup.xml',
  },
];

const generate = () => {
  inquirer.prompt(questionsGenerator).then(answers => {
    console.log(
      colors.blue.bold(
        '\nYou are going to create the initial setup file with values:'
      )
    );
    console.log('Square width: ', Number(answers.squareDimension));
    console.log('Species: ', Number(answers.species));
    console.log('Iterations: ', answers.iterations);

    setupFile(
      Number(answers.squareDimension),
      Number(answers.species),
      answers.iterations,
      'game-of-life-setup.xml'
    );
  });
};

const game = () => {
  inquirer.prompt(questionsGame).then(answers => {
    console.log(
      colors.blue.bold(
        '\nYou are going to execute the Game of Live with the following parameter:'
      )
    );
    console.log('Initial file: ', colors.yellow(answers.initialFile));

    gameOfLife(answers.initialFile, 'game-of-life-final.xml');
  });
};

program
  .command('generate')
  .description('Generate initial Game of Life setup')
  .action(() => {
    console.log(title);
    generate();
  });

program
  .command('game-of-life')
  .description('Run Game of Life')
  .action(() => {
    console.log(title);
    game();
  });

program.parse(process.argv);
