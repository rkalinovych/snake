const blessed = require('blessed')


class UserInterface {
  constructor() {
    this.blessed = blessed
    this.screen = blessed.screen()

    this.screen.title = 'Snake'

    this.gameBox = this.createGameBox()
    this.scoreBox = this.createScoreBox()
    this.gameOverBox = this.createGameOverBox()

    this.gameContainer = this.blessed.box(this.gameBox)
    this.scoreContainer = this.blessed.box(this.scoreBox)
  }

  createGameBox() {
    return {
      parent: this.screen,
      top: 1,
      left: 0,
      width: '100%',
      height: '100%-1',
      style: {
        fg: 'black',
        bg: 'black',
      },
    }
  }

  createScoreBox() {
    return {
      parent: this.screen,
      top: 0,
      left: 'left',
      width: '100%',
      height: 1,
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue',
      },
    }
  }

  createGameOverBox() {
    return {
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: 20,
      height: 6,
      tags: true,
      valign: 'middle',
      content: `{center}Game Over!\n\nPress enter to try again{/center}`,
      border: {
        type: 'line',
      },
      style: {
        fg: 'black',
        bg: 'magenta',
        border: {
          fg: '#ffffff',
        },
      },
    }
  }

  bindHandlers(keyPressHandler, quitHandler, enterHandler) {
    this.screen.on('keypress', keyPressHandler)
    this.screen.key(['escape', 'q', 'C-c'], quitHandler)
    this.screen.key(['enter'], enterHandler)
  }

  draw(coord, color) {
    this.blessed.box({
      parent: this.gameContainer,
      top: coord.y,
      left: coord.x,
      width: 1,
      height: 1,
      style: {
        fg: color,
        bg: color,
      },
    })
  }

  updateScore(score) {
    this.scoreContainer.setLine(0, `{bold}Score:{/bold} ${score}`)
  }

  gameOverScreen() {
    this.gameContainer = this.blessed.box(this.gameOverBox)
  }

  clearScreen() {
    this.gameContainer.detach()
    this.gameContainer = this.blessed.box(this.gameBox)
  }

  resetScore() {
    this.scoreContainer.detach()
    this.scoreContainer = this.blessed.box(this.scoreBox)
    this.updateScore(0)
  }

  render() {
    this.screen.render()
  }
}

module.exports = { UserInterface }