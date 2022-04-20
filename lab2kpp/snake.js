const {
  GAME_SPEED,
  DIRECTIONS,
  INITIAL_SNAKE_SIZE,
  SNAKE_COLOR,
  DOT_COLOR,
  DIRECTION_UP,
  DIRECTION_RIGHT,
  DIRECTION_DOWN,
  DIRECTION_LEFT,
} = require('./constants')

class Game {
  constructor(ui) {
    this.ui = ui

    this.reset()

    this.ui.bindHandlers(
      this.changeDirection.bind(this),
      this.quit.bind(this),
      this.start.bind(this)
    )
  }

  reset() {
    this.snake = []

    for (let i = INITIAL_SNAKE_SIZE; i >= 0; i--) {
      this.snake[INITIAL_SNAKE_SIZE - i] = { x: i, y: 0 }
    }
    this.headColor ='blue'
    this.dots = []
    this.score = 0
    this.currentDirection = DIRECTION_RIGHT
    this.changingDirection = false
    this.timer = null
    this.generateDots()
    this.ui.resetScore()
    this.ui.render()
  }

  generateDots(){
    for(let i=0; i<3; i++){
      var dot = this.generateDot()
      this.dots.push(dot)
    }
  }

  changeDirection(_, key) {
    if ((key.name === DIRECTION_UP || key.name === 'w') && this.currentDirection !== DIRECTION_DOWN) {
      this.currentDirection = DIRECTION_UP
    }
    if ((key.name === DIRECTION_DOWN || key.name === 's') && this.currentDirection !== DIRECTION_UP) {
      this.currentDirection = DIRECTION_DOWN
    }
    if ((key.name === DIRECTION_LEFT || key.name === 'a') && this.currentDirection !== DIRECTION_RIGHT) {
      this.currentDirection = DIRECTION_LEFT
    }
    if ((key.name === DIRECTION_RIGHT || key.name === 'd') && this.currentDirection !== DIRECTION_LEFT) {
      this.currentDirection = DIRECTION_RIGHT
    }
  }

  
  moveSnake() {
    if (this.changingDirection) {
      return
    }
    this.changingDirection = true

    const head = {
      x: this.snake[0].x + DIRECTIONS[this.currentDirection].x,
      y: this.snake[0].y + DIRECTIONS[this.currentDirection].y,
    }

    this.snake.unshift(head)
    var lalala = this.dots.find(dot => this.snake[0].x === dot.x && this.snake[0].y === dot.y)
    if (lalala){
      this.score++
      this.score % 2 == 0 ? this.headColor = '#' + Math.floor(Math.random()*16777215).toString(16): this.headColor;
      this.dots.splice(this.dots.indexOf(lalala),1)
      this.ui.updateScore(this.score)
      if(this.dots.length == 0){
        this.generateDots()
      }
    } else {
      this.snake.pop()
    }
  }

  generateRandomPixelCoord(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  generateDot() {
    var dot = {}
    dot.x = this.generateRandomPixelCoord(0, this.ui.gameContainer.width - 1),
    dot.y = this.generateRandomPixelCoord(1, this.ui.gameContainer.height - 1)
    
    this.snake.forEach(segment => {
      if (segment.x === dot.x && segment.y === dot.y) {
        this.generateDot()
      }
    })
    return dot;
  }

  drawSnake() {
    this.snake.forEach(segment => {
      if(segment == this.snake[0])
      {
        this.ui.draw(segment, this.headColor) 
      }else{
        this.ui.draw(segment, SNAKE_COLOR)
      }
    })
  }

  drawDot() {
    this.dots.forEach(dot => {
      this.ui.draw(dot, DOT_COLOR)
    })
  }

  isGameOver() {
    const collide = this.snake
      .filter((_, i) => i > 0)
      .some(segment => segment.x === this.snake[0].x && segment.y === this.snake[0].y)

    return (
      collide ||
      this.snake[0].x >= this.ui.gameContainer.width - 1 ||
      this.snake[0].x <= -1 ||
      this.snake[0].y >= this.ui.gameContainer.height - 1 ||
      this.snake[0].y <= -1
    )
  }

  showGameOverScreen() {
    this.ui.gameOverScreen()
    this.ui.render()
  }

  tick() {
    if (this.isGameOver()) {
      this.showGameOverScreen()
      clearInterval(this.timer)
      this.timer = null

      return
    }

    this.changingDirection = false
    this.ui.clearScreen()
    this.drawDot()
    this.moveSnake()
    this.drawSnake()
    this.ui.render()
  }

  start() {
    if (!this.timer) {
      this.reset()

      this.timer = setInterval(this.tick.bind(this), GAME_SPEED)
    }
  }

  quit() {
    process.exit(0)
  }
}

module.exports = { Game }