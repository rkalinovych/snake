#!/usr/bin/env node

const { Game } = require('./snake.js')
const { UserInterface } = require('./content.js')
const game = new Game(new UserInterface())

// Begin game
game.start()