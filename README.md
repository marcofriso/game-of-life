# Game of Life

## Generate setup file

`node bin/app.js generate`

This function creates a setup XML file that can be used to execute the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
You will be asked to choose:

- square width
- number of species
- number of iterations

The file follows the schema:

```xml
<?xml version="1.0" encoding="UTF­8"?>
<life>
  <world>
    <cells>n</cells> // Dimension of the square "world"
    <species>m</species> // Number of distinct species
    <iterations>4000000</iterations> // Number of iterations to be calculated
  </world>
  <organisms>
    <organism>
      <x_pos>x</x_pos> // x position
      <y_pos>y</y_pos> // y position
      <species>t</species> // Species type
    <organism>
  </organisms>
</life>
```

## Run Game of Life

`node bin/app.js game-of-life`

You will be asked to provide a file compatible with the one supplied by the `generate` function.
