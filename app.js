const startBtn = document.getElementById('startBtn')
const screens = document.querySelectorAll('.screen')
const chooseBtn = document.querySelectorAll('.choose-sweet-btn')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const gameNode = document.getElementById('game-container')
const finishBtn = document.getElementById('finishBtn')
const mainMenuBtn = document.getElementById('mainMenuBtn')
const restartBtn = document.getElementById('restartBtn')
const finishWindow = document.getElementById('finishWindow')
const gameTopContainer = document.getElementById('gameTopContainer')
const scoredPts = document.getElementById('scoredPts')
const tookTime = document.getElementById('tookTime')
const soundBtn = document.getElementById('soundBtn')
const soundImg = document.getElementById('soundImg')
const pauseBtn = document.getElementById('pauseBtn')
const helloBtn = document.getElementById('hello')
const scoreBtns = document.querySelectorAll('.score-btn')
const arrowBackBtn = document.querySelectorAll('.arrow-back-btn')
const listScoreEls = document.querySelectorAll('.listScoreEl')
const scoresList = document.getElementById('scoresList')
const congrateTitle = document.getElementById('congrateTitle')
const recordListBtn = document.getElementById('recordListBtn')
const burgerMenuBtn = document.getElementById('burgerMenuBtn')
const burgerMenuImg = document.getElementById('burgerMenuImg')
const gameTopContainerBtns = document.getElementById('gameTopContainerBtns')
 
const sweet = document.createElement('img')
let seconds = 0.0
let score = 0
let chosenSweet = { }

let isSoundOn = true
let isPauseActive = false
let isSecondsMoreTen = false
let isMenuOpen = false

let timeInterval

function startGame() {
    pauseBtn.innerHTML = `Pause`
    timeEl.innerHTML = `Time: ${floatFixed(seconds)}`
    scoreEl.innerHTML = `Score: ${score}`
    timeInterval = setInterval(increaseTime, 100);
}

function floatFixed(value) {
    return parseFloat(value.toFixed(8))
}

function changeInterval() {
    clearInterval(timeInterval)
    timeInterval = setInterval(increaseTime, 1000)
}
 
function increaseTime() {
    if (seconds >= 9.9) {
        seconds++
    } else {
        seconds += 0.1
    }

    if (floatFixed(seconds) == 10) {
        changeInterval()
        isSecondsMoreTen = true
    }
    timeEl.innerHTML = `Time: ${floatFixed(seconds)}`
  }

function increaseScore() {
    score++
    scoreEl.innerHTML = `Score: ${score}`

    const goals = [scoreBtns[0].textContent,
                   scoreBtns[1].textContent,
                   scoreBtns[2].textContent]

    let isRecord = false

    if (score === goalPoints && goalPoints !== -1) {
        for (let goal = 0; goal < goals.length; goal++) {
            if (goals[goal] == goalPoints) {
                const currValue = listScoreEls[goal].getAttribute('value')
                if (currValue == -1 || floatFixed(seconds) < currValue) {
                    listScoreEls[goal].innerHTML = `Score ${goalPoints} - ${floatFixed(seconds)} seconds`
                    listScoreEls[goal].setAttribute('value', floatFixed(seconds))
                    isRecord = true
                }
            }
        }
        endGame(isRecord)
    }
}

// Получение рандомных координат
function getRandomCoords() {
    const width = window.innerWidth
    const height = window.innerHeight
    let x = (Math.random() * width) - 100
    let y = (Math.random() * height) - 100

    x = x < 0 ? x = -x : x
    y = y < 0 ? y = -y : y

    if (y < 60) {
        y = Math.random() * 10 + 60
    }

    return {x, y}
}

// Создание и вывод сладости на экран по координатам x, y
function addSweet() {
    const {x, y} = getRandomCoords()

    sweet.src = chosenSweet.src

    sweet.addEventListener('click', catchSweet)

    sweet.classList.add('sweet')
    sweet.style.display = 'block'
    sweet.style.top = `${y}px`
    sweet.style.left = `${x}px`
    sweet.style.transform = `rotate(${Math.random() * 360}deg)`

    gameNode.appendChild(sweet) // Добавление на страницу
}

// События происходящии при нажатии на сладость
function catchSweet() {
    if (!isPauseActive) {
        playSoundBite(isSoundOn)
        this.remove() // Удаление текущего элемента (сладости)
        addSweet()
        increaseScore()
    }
}

// Звук при нажатии на сладость
function playSoundBite(fl) {
    const audio = document.getElementById('bite')
    if (fl) {
        audio.play()
    }
}

function endGame(isRecord = false) {
    finishWindow.classList.add('visible')
    gameTopContainer.style.display = 'none'

    if (score > listScoreEls[3].getAttribute('value')) {
        listScoreEls[3].innerHTML = `Max score - ${score} pts`
        listScoreEls[3].setAttribute('value', score)
        isRecord = true
    }

    if (isRecord) {
        congrateTitle.innerHTML = `New Record!`
    } else {
        congrateTitle.innerHTML = `The Game is over`
    }

    scoredPts.innerHTML = `You scored ${score} pts`
    tookTime.innerHTML = `It took you ${floatFixed(seconds)} seconds`
    sweet.style.display = 'none'

    finishGame()
}

// Обнуление переменных: время, очки и остановка интервала
function finishGame() {
    seconds = 0.0
    score = 0
    isPauseActive = false
    isSecondsMoreTen = false
    isMenuOpen = false
    burgerMenuImg.setAttribute('src', 'assets/burger-menu.png')
    gameTopContainerBtns.classList.remove('visible')
    pauseTitle.classList.remove('visible')
    startBtn.classList.remove('active')
    recordListBtn.classList.remove('active')
    listScoreEls.forEach(el => {
        el.classList.remove('active')
    })
    clearInterval(timeInterval)
}

function addListScoreEl(index, act) {
    if (act === 'add') {
        listScoreEls[index].classList.add('active')
    } else if (act === 'remove') {
        listScoreEls[index].classList.remove('active')
    }
}

soundBtn.addEventListener('click', () => {
    if (isSoundOn) {
        soundImg.setAttribute('src', 'assets/sound-off.png')
        isSoundOn = false
    } else {
        soundImg.setAttribute('src', 'assets/sound-on.png')
        isSoundOn = true
    }
})

startBtn.addEventListener('click', () => {
    screens[0].classList.remove('visible')
    screens[1].classList.add('visible')
})

recordListBtn.addEventListener('click', () => {
    if (recordListBtn.classList.contains('active')) {
        recordListBtn.classList.remove('active')
        startBtn.classList.remove('active')
        listScoreEls.forEach(el => {
            el.classList.remove('active')
        })
    } else {
        recordListBtn.classList.add('active')
        startBtn.classList.add('active')
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (recordListBtn.classList.contains('active')) {
                    addListScoreEl(i, 'add')
                }
            }, 200 * i)
        }
    }
})

arrowBackBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        screens[Number(btn.getAttribute('value'))].classList.remove('visible')
        screens[Number(btn.getAttribute('value')) - 1].classList.add('visible')
    })
})

chooseBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        screens[2].classList.remove('visible')
        screens[3].classList.add('visible')

        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        chosenSweet = { src }

        addSweet()
        startGame()
    })
})

burgerMenuBtn.addEventListener('click', () => {
    if (isMenuOpen) {
        burgerMenuImg.setAttribute('src', 'assets/burger-menu.png')
        gameTopContainerBtns.classList.remove('visible')
        isMenuOpen = false
    } else {
        burgerMenuImg.setAttribute('src', 'assets/x-btn.png')
        gameTopContainerBtns.classList.add('visible')
        isMenuOpen = true
    }
})

finishBtn.addEventListener('click', () => {
    endGame()
})

mainMenuBtn.addEventListener('click', () => {
    chosenSweet = { } // Сбрасываю текущую сладость
    screens[3].classList.remove('visible')
    screens[0].classList.add('visible')
    finishWindow.classList.remove('visible')
    gameTopContainer.style.display = 'flex'
})

restartBtn.addEventListener('click', () => {
    finishWindow.classList.remove('visible')
    gameTopContainer.style.display = 'flex'

    finishGame()
    addSweet()
    startGame()
})

const pauseTitle = document.createElement('h2')
pauseTitle.innerHTML = 'The game is on pause'
pauseTitle.classList.add('pause-title')
gameNode.appendChild(pauseTitle)

pauseBtn.addEventListener('click', () => {
    if (isPauseActive) {
        pauseBtn.innerHTML = `Pause`
        isPauseActive = false
        sweet.style.display = 'block'
        pauseTitle.classList.remove('visible')
        timeInterval = setInterval(increaseTime, isSecondsMoreTen ? 1000 : 100);
    } else {
        pauseBtn.innerHTML = `Continue`
        isPauseActive = true
        sweet.style.display = 'none'
        pauseTitle.classList.add('visible')
        clearInterval(timeInterval)
    }
})

let goalPoints
scoreBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        goalPoints = Number(btn.textContent)
        goalPoints == 'Inf' ? goalPoints = -1 : goalPoints
        screens[1].classList.remove('visible')
        screens[2].classList.add('visible')
    })
})
