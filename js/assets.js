const assets = {
    bird: {
        red: { 
            name: 'bird-red',
            clapWings: 'red-clap-wings',
            stop: 'red-stop'
        },
        blue: {
            name: 'bird-blue',
            clapWings: 'blue-clap-wings',
            stop: 'blue-stop'
        },
        yellow: {
            name: 'bird-yellow',
            clapWings: 'yellow-clap-wings',
            stop: 'yellow-stop'
        }
    },
    obstacle: {
        pipe: {
            green: {
                top: 'pipe-green-top',
                bottom: 'pipe-green-bottom'
            },
            red: {
                top: 'pipe-red-top',
                bottom: 'pipe-red-bottom'
            }
        }
    },
    scene: {
        width: 144,
        background: {
            day: 'background-day',
            night: 'background-night'
        },
        ground: 'ground',
        gameOver: 'game-over',
        restartGame: 'restart-button',
        startGame: 'start-game'
    },
    scoreboard: {
        width: 25,
        base: 'number',
        number0: '0',
        number1: '1',
        number2: '2',
        number3: '3',
        number4: '4',
        number5: '5',
        number6: '6',
        number7: '7',
        number8: '8',
        number9: '9'
    },
    animation: {
        ground: {
            moving: 'moving-ground',
            stop: 'stop-ground'
        }
    }
}

export default assets;