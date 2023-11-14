const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector("#updatedScore")
const finalScore = document.querySelector("#finalScore")
const button = document.querySelector("#button")
const button_1st = document.querySelector("#button_1st")
const  NewgameWindow = document.querySelector(".NewgameWindow")
const  startingWindow = document.querySelector(".startingWindow")
const lavelBox = document.querySelector(".lavel-box")

canvas.width = innerWidth
canvas.height = innerHeight

let updatedScore = 0
let startGame = false;


class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
const friction = 0.99
class Pratical {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
    update() {
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}
const playerRadius = 15
let player = new Player(canvas.width / 2,
    canvas.height - playerRadius,
    playerRadius, "white")



let projectiles = []
let enemies = []
let explosionPartical = []
let speedincrease = 100
let enemySpawnTime = 2000

let deficultyLavel = 0
let lavelScore = 200
let LImageNO = 0
let endMassage = false

function inhit(){
    player = new Player(canvas.width / 2,
    canvas.height - playerRadius,
    playerRadius, "white")

    projectiles = []
    enemies = []
    explosionPartical = []
    speedincrease = 100
    enemySpawnTime = 2000
    updatedScore = 0
    finalScore.innerHTML = updatedScore
    score.innerHTML  = updatedScore
    LImageNO = 2
    enemySpawnTime = 2000
    deficultyLavel = 0
    lavelScore = 200
    endMassage = false

}

let enemiesSpawnfunc = () => {
    let radius = Math.random() * (35 - 8) + 8

    let x
    let y
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius :
            canvas.width + radius
        y = Math.random() * canvas.height / 2
    }
    else {
        x = Math.random() * canvas.width
        y = 0
    }
    let angle = Math.atan2(y - player.y, x - player.x)

    let velocity = {
        x: -Math.cos(angle),
        y: -Math.sin(angle) 
    }
        if(updatedScore >= speedincrease){
            velocity.x *= 3
            velocity.y *= 3
            speedincrease += 100
        }
    
    let color = `hsl(${Math.random() * 360},50%,50%)`

    enemies.push(new Enemy(x, y, radius, color, velocity))
}

let EnemySpawnId;
 
function spawnEnemies() {
    EnemySpawnId = setInterval(enemiesSpawnfunc, enemySpawnTime)
}


// *****************************************************
const lavelImg = document.querySelector(".img")
const lavelText = document.querySelector(".text")
const bar = document.querySelector(".bar")
const current = document.querySelector(".current")
const endPop = document.querySelector(".endMassage")

let barUnit = 100 / lavelScore

lavelImg.style.backgroundImage = `url(./images/${LImageNO}.png)`
lavelText.innerText = storyList[LImageNO]

// *****************************************************
// lavel System 
// ----------------
const lavelUpfucn = ()=>{
    if(LImageNO > 2){
        lavelBox.style.display = "none"
        endPop.style.display = "none"
        if(startGame){
            spawnEnemies()
            animate()
        }
        lavelBox.removeEventListener("click", lavelUpfucn)
    }

    if(LImageNO <= 2){
        lavelImg.style.backgroundImage = `url(./images/${LImageNO}.png)`
        lavelText.innerText = storyList[LImageNO]
        lavelBox.addEventListener("click", lavelUpfucn)
        LImageNO ++
    }

}

// console.log(bar)

lavelBox.addEventListener("click", lavelUpfucn)

// *****************************************************

let animateId

function animate() {
    if(startGame){
        animateId = requestAnimationFrame(animate)
    }

    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((porjectile,index) => {        
        if(porjectile.x < 0 || porjectile.x > canvas.width){
            projectiles.splice(index,1)
        }else if(porjectile.y < 0 || porjectile.y > canvas.height){
            projectiles.splice(index,1)
        }else{
        porjectile.update()
        }
    })
    explosionPartical.forEach((pertiacl,index) => {
        if(pertiacl.alpha <= 0){
            explosionPartical.splice(index,1)
        }else{
        pertiacl.update()
        }
    })

    // ***************************************************
    // for bar to show on top
    barUnit = 100 / lavelScore
    if(barUnit * updatedScore <= 100){
        bar.style.width = `${barUnit * updatedScore}%`
    }

    // ********************************************************
    // console.log(updatedScore)
    // let's add some lavel here
    // -----------------------------------------------------
    if(updatedScore > lavelScore && !endMassage){
        cancelAnimationFrame(animateId)
        // console.log(EnemySpawnId)
        clearInterval(EnemySpawnId)

        
        deficultyLavel += 1
        current.innerText = `Current : ${deficultyLavel}`
        
        if(enemySpawnTime > 800){
            enemySpawnTime -= (enemySpawnTime / 10) * 4
        }
        
        if(LImageNO < storyList.length - 1){
            LImageNO ++
            lavelImg.style.backgroundImage = `url(./images/${LImageNO}.png)`
            lavelText.innerText = storyList[LImageNO]
            lavelBox.style.display = "block"
            lavelScore = lavelScore * 2

            if(LImageNO == storyList.length - 1){
                endMassage = true
                endPop.style.display = "block"
            }
        }

        // console.log(enemySpawnTime)
        setTimeout(()=>{
            lavelBox.addEventListener("click", lavelUpfucn)
        },2000)
    }

    // ********************************************************

    enemies.forEach((enemy, index) => {
        enemy.update()
        let dist = Math.hypot(enemy.x - player.x,
            enemy.y - player.y)

        

        //End game
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animateId)
            clearInterval(EnemySpawnId)
            finalScore.innerHTML = updatedScore
            NewgameWindow.style.display = "flex"
        }

        projectiles.forEach((porjectile, indexProjectile) => {
            let dist = Math.hypot(enemy.x - porjectile.x,
                enemy.y - porjectile.y)

            //enemy eleminate

            if (dist - enemy.radius - porjectile.radius < 1) {
                for (i = 0; i < enemy.radius; i++) {

                    //explosion pertical creation
                    explosionPartical.push(new Pratical(porjectile.x,
                        porjectile.y,
                        Math.random() * 2, enemy.color,
                        {
                            x: (Math.random() - 0.5)
                            * (Math.random() * 7),
                            y: (Math.random() - 0.5) 
                            * (Math.random() * 7)
                        }))
                }
                if (enemy.radius - 10 > 10) {
                    enemy.radius -= 10
                    projectiles.splice(indexProjectile, 1)
                    updatedScore += 5
                    score.innerHTML  = updatedScore
                } else {
                    enemies.splice(index, 1)
                    projectiles.splice(indexProjectile, 1)
                    updatedScore += 15
                    score.innerHTML  = updatedScore
                }
            }
        })
    })

}

addEventListener("mousedown", (e) => {
    const angle = Math.atan2(e.clientY - player.y,
        e.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(player.x, player.y, 5,
        "white",
        velocity))
})
button_1st.addEventListener('click',()=>{
    startGame = true
    inhit()
    animate()
    spawnEnemies()
    startingWindow.style.display = "none"
})

button.addEventListener('click',()=>{
    startGame = true
    inhit()
    animate()
    spawnEnemies()
    NewgameWindow.style.display = "none"
})