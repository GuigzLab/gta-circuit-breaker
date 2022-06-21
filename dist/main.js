const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Canvas settings
canvas.width = 0.6 * innerWidth
canvas.height = canvas.width / 16 * 9

// State of game
let started = false

function readTextFile(file) {
     let allText
     let rawFile = new XMLHttpRequest()
     rawFile.open("GET", file, false)
     rawFile.onreadystatechange = function () {
          if (rawFile.readyState === 4) {
               if (rawFile.status === 200 || rawFile.status == 0) {
                    allText = rawFile.responseText
               }
          }
     }
     rawFile.send(null)
     return allText
}

console.log(readTextFile("../map1.txt").split('\r\n'))

let maps = JSON.parse(readTextFile("../maps.json"))

const mapSettings = maps[0]
const map = readTextFile(mapSettings.map).split('\r\n')

const startPort = document.querySelector('.canvas-container .start')
startPort.style.left = mapSettings.startPort.x + "px"
startPort.style.top = mapSettings.startPort.y + "px"
startPort.style.display = "block"
startPort.style.transform = `rotate(${mapSettings.startPort.rotation}deg)`

const endPort = document.querySelector('.canvas-container .end')
endPort.style.right = mapSettings.endPort.x + "px"
endPort.style.bottom = mapSettings.endPort.y + "px"
endPort.style.display = "block"
endPort.style.transform = `rotate(${mapSettings.endPort.rotation}deg)`

const xStart = mapSettings.startPort.x + startPort.offsetWidth / 2
const yStart = mapSettings.startPort.y + startPort.offsetHeight / 2
console.log(xStart, yStart)

function drawMap() {
}

class Player {
     constructor() {
          this.position = {
               x: xStart,
               y: yStart
          }
          this.speed = mapSettings.speed
          this.velocity = {
               x: mapSettings.velocity.x,
               y: mapSettings.velocity.y
          }


          this.path = []
          this.smallRadius = 2
          this.bigRadius = 6
     }

     draw() {
          c.fillStyle = '#389F73'
          this.path.forEach((e) => {
               const pos = JSON.parse(e)
               let smallCircle = new Path2D()
               smallCircle.arc(pos.x, pos.y, this.smallRadius, 0, 2 * Math.PI, false)
               c.fill(smallCircle)
          })

          let bigCircle = new Path2D()
          bigCircle.arc(this.position.x, this.position.y, this.bigRadius, 0, 2 * Math.PI, false)
          c.fill(bigCircle)
     }

     update() {
          // TODO - Lose function and detect BBs
          if (this.position.x - this.bigRadius + this.velocity.x > 0 && this.position.x + this.bigRadius + this.velocity.x < canvas.width) {
               this.position.x += this.velocity.x
          }
          if (this.position.y - this.bigRadius + this.velocity.y > 0 && this.position.y + this.bigRadius + this.velocity.y < canvas.height) {
               this.position.y += this.velocity.y
          }

          // TODO - Detect direction changes and draw rectangles to reduce memory usage and computation time
          const actualPos = JSON.stringify(this.position)
          if (!this.path.includes(actualPos)) {
               this.path.push(actualPos)
          }
          this.draw()
     }
}

const player = new Player()

function animate() {
     requestAnimationFrame(animate)
     c.clearRect(0, 0, canvas.width, canvas.height)
     drawMap()
     if (started) {
          player.update()
     }
}

animate()

addEventListener('keydown', ({
     key
}) => {
     switch (key) {
          case 'ArrowLeft':
               if (player.velocity.x == 0) {
                    player.velocity.x = -player.speed
                    player.velocity.y = 0
               }
               break
          case 'ArrowUp':
               if (player.velocity.y == 0) {
                    player.velocity.y = -player.speed
                    player.velocity.x = 0
               }
               break
          case 'ArrowRight':
               if (player.velocity.x == 0) {
                    player.velocity.x = player.speed
                    player.velocity.y = 0
               }
               break
          case 'ArrowDown':
               if (player.velocity.y == 0) {
                    player.velocity.y = player.speed
                    player.velocity.x = 0
               }
               break
          case ' ':
               if (!started) {
                    started = true
                    const title = document.querySelector('.canvas-container h3')
                    title.style.opacity = 0
               }
               break

          default:
               break
     }
})