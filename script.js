import { updateBird, setupBird, getBirdRect } from "./bird.js"
import { updatePipes, setupPipes, getPassedPipeCount, getPipeRect, updatePipeSpeed } from "./pipe.js"
// document.addEventListener("keypress", handleStart, {once: true})
document.addEventListener("keypress", handleStart, {once: true});

document.querySelector('[data-wallet]').addEventListener('click', connectWallet);

// Rest of your code remains the same

const title = document.querySelector("[data-title]")
const subtitle = document.querySelector("[data-subtitle]")
const birdChange = document.querySelector("[data-bird]")
let lastTime
let highestScore = 0
let currentScore = 0

function updateLoop(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(updateLoop)
        return
    }
    const delta = time - lastTime
    updateBird(delta)
    updatePipes(delta)
    if (checkLose()) return handleLose()
    lastTime = time
    currentScore = getPassedPipeCount()
    if ( currentScore >= highestScore)  {
        highestScore =  currentScore 
        document.getElementById('highScore').innerText = `Highscore: ${highestScore}  `
        document.getElementById('currentScore').innerText = `New Record Set`
    } else {
        document.getElementById('highScore').innerText = `Highscore: ${highestScore} `
        document.getElementById('currentScore').innerText = `${highestScore - currentScore} to beat previous record`
        // if (highestScore == 0) {
        //     document.getElementById('currentScore').innerText = `Fresh game`
        // } else {
        //     document.getElementById('currentScore').innerText = `${highestScore - currentScore} to beat previous record`
        // }
        
    }
    let newMultiplier
    
    newMultiplier = (0.5 + currentScore / 200 ) 
    updatePipeSpeed(newMultiplier) 
    
    
    
    window.requestAnimationFrame(updateLoop) 
}

function checkLose() {
    const birdRect = getBirdRect()
    const insidePipe = getPipeRect().some(rect => isCollision(birdRect, rect))
    const outsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight

    return outsideWorld || insidePipe
    
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left  &&
        rect1.bottom > rect2.top
    )
}

function handleStart() {
    title.classList.add("hide")
    birdChange.classList.remove("hide")
    setupBird()
    setupPipes()
    lastTime == null
    window.requestAnimationFrame(updateLoop)
}

function handleLose() {
    setTimeout (() => {
    title.classList.remove("hide")
    subtitle.classList.remove("hide")
    birdChange.classList.add("hide")
    subtitle.textContent = ` You are GAY `
    
    document.addEventListener("keypress", handleStart, {once: true})
    }, 100)
}


// Logic for metamask connect

if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    console.log('MetaMask is installed!');
} else {
    alert('Please install MetaMask to use this feature.');
}

// const textChange =  document.getElementsByClassName('wallet')
const textChange =  document.getElementsByClassName('wallet')[0];

async function connectWallet() {
    
    if (window.ethereum) { // Check if MetaMask is installed
        try {
            // Request account access
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            textChange.innerText = truncateAddress(accounts[0]);
            // document.getElementById('addressText').innerText = `Connected: ${account}`
            console.log('Working fine')
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please check the console for details.');
        }
    } else {
        alert('MetaMask is not installed. Please install it and try again.');
    }
}

function truncateAddress(address) {
    return address.substring(0, 4) + '...' + address.substring(address.length - 4);
}

// document.querySelector('[data-wallet]').addEventListener('click', connectWallet)