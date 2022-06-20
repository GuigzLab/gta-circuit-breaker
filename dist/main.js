const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 0.6 * innerWidth
canvas.height = canvas.width / 16 * 9

// console.log(canvas)

class Player {
     constructor() {
          this.position = {
               x: 20,
               y: 20
          }
          this.velocity = {
               x: 0,
               y: 1
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
          if (this.position.x - this.bigRadius / 2 + this.velocity.x > 0 && this.position.x + this.bigRadius / 2 + this.velocity.x < canvas.width) {
               this.position.x += this.velocity.x
          }
          if (this.position.y - this.bigRadius / 2 + this.velocity.y > 0 && this.position.y + this.bigRadius / 2 + this.velocity.y < canvas.height) {
               this.position.y += this.velocity.y
          }
          
          // TODO - Detect direction changes and draw rectangles
          const actualPos = JSON.stringify(this.position)
          if (!this.path.includes(actualPos)){
               this.path.push(actualPos)
          }
          this.draw()
     }
}

const player = new Player()

function animate() {
     requestAnimationFrame(animate)
     c.clearRect(0, 0, canvas.width, canvas.height)
     player.update()
}

animate()

addEventListener('keydown', ({
     key
}) => {
     switch (key) {
          case 'ArrowLeft':
               if (player.velocity.x == 0){
                    player.velocity.x = -1
                    player.velocity.y = 0
               }
               break
          case 'ArrowUp':
               if (player.velocity.y == 0){
                    player.velocity.y = -1
                    player.velocity.x = 0
               }
               break
          case 'ArrowRight':
               if (player.velocity.x == 0){
                    player.velocity.x = 1
                    player.velocity.y = 0
               }
               break
          case 'ArrowDown':
               if (player.velocity.y == 0){
                    player.velocity.y = 1
                    player.velocity.x = 0
               }
               break

          default:
               break
     }
})