import { makeTimer } from '@solid-primitives/timer'
import { Body } from 'solid-start';

export type ArrowKey = "ARROWUP" | "ARROWDOWN" | "ARROWLEFT" | "ARROWRIGHT";

export type GameStatus = "alive" | "dead" | "dying" | "won_level"

export type Snake = {
    head: { x: number, y: number };
    body: { x: number, y: number }[];
    length: number;
    character: "S";
}

export type Game = {
    lives: number;
    level: number;
    subLevel: number;
    commands: ArrowKey[];
    direction: "up" | "down" | "left" | "right";
    gameStatus: GameStatus;
    width: number;
    height: number;
    grid: string[][];
    snake?: Snake;
    obsticles: { x: number, y: number }[];
    goals: { x: number, y: number }[];
    clock: number;
    restrictedKeys: ArrowKey[];
}

export const newGame = (width: number, height: number): Game => {
    const grid: string[][] = [];
    const obsticles: {x: number, y:number }[] = [];
    for (let y = 0; y < height; y++) {
        grid.push([]);
        for (let x = 0; x < width; x++) {
            grid[y].push(' ');
        }
    }
    const transition = 0
    const level = 1;
    const subLevel = 1;
    const lives = 100;
    const goals = [];
    const clock = 0;
    const playing = false;
    const commands = []
    const direction = "right";
    const gameStatus = "dead"
    const restrictedKeys = [];
    return { 
        gameStatus, commands, direction, lives, level, subLevel,
        width, height, grid, obsticles, goals, clock, restrictedKeys
    };
}

export const clearBoard = (game: Game, setGame) => {
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            setGame('grid', y, x, " ");
        }
    }
}

export const setWalls = (game: Game, setGame) => {
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            if(y==0 || y==game.height-1 || x==0 || x==game.width-1){
                setGame('grid', y, x, "W");               
            }
        }
    }
}

export const setSnake = (game: Game, setGame) => {
    while (true) {
        const x = Math.floor(Math.random() * (game.width-2))+1;
        const y = Math.floor(Math.random() * (game.height-2))+1;
        
        // Probably shouldn't use the grid for game logic
        if (game.grid[y][x] === " ") {
            setGame('grid', y, x, "S");
            setGame('snake', {
                head: { x, y },
                body: [{x, y}],
                length: 1
            });
            return;
        }
    }
}    

export const setObsticles = (game: Game, setGame ) => {
    for(let i=0; i<game.level*3; i++) {
        const x = Math.floor(Math.random() * (game.width-2))+1;
        const y = Math.floor(Math.random() * (game.height-2))+1;
        if (game.grid[y][x] == " ") {
                setGame('grid', y, x, "W");
        }
    }
}


export const setGoals = (game: Game, setGame) => {
    for(let i=0; i<10; i++) {
        const x = Math.floor(Math.random() * (game.width-2))+1;
        const y = Math.floor(Math.random() * (game.height-2))+1;
        if (game.grid[y][x] === " ") {
                setGame('grid', y, x, "G");
                setGame('goals', game.goals.concat({x, y}))
        }
    }
}

export const setDirection = (game: Game, setGame) => {
    if(game.commands.length > 0) {
        const command = game.commands[0];
        if(command == "ARROWUP" && game.direction != "down") {
            setGame('direction', "up");
        } else if(command == "ARROWDOWN" && game.direction != "up") {
            setGame('direction', "down");
        } else if(command == "ARROWLEFT" && game.direction != "right") {
            setGame('direction', "left");
        } else if(command == "ARROWRIGHT" && game.direction != "left") {
            setGame('direction', "right");
        }
        setGame('commands', game.commands.slice(1))
    }
}

export const advanceSnake = (game: Game, setGame) => {    
    if(game.direction == "right") {
        setGame('snake', 'head', 'x', game.snake.head.x+1);
    }
    if(game.direction == "left") {
        setGame('snake', 'head', 'x', game.snake.head.x-1);
    }
    if(game.direction == "up") {
        setGame('snake', 'head', 'y', game.snake.head.y-1);
    }
    if(game.direction == "down") {
        setGame('snake', 'head', 'y', game.snake.head.y+1);
    }

    // Handle Intersecting a Snake
    if(game.grid[game.snake.head.y][game.snake.head.x] == "S") {
        setGame('gameStatus', "dying");
    }

    // Handle Intersecting a Wall
    if(game.grid[game.snake.head.y][game.snake.head.x] == "W") {
        setGame('gameStatus', "dying");    
    }

    // Handle Intersecting an Obsticle
    if(game.grid[game.snake.head.y][game.snake.head.x] == "O") {
        setGame('gameStatus', "dying");
    }

    // Handle Intersecting a Goal
    if(game.grid[game.snake.head.y][game.snake.head.x] == "G") {
        setGame('goals', game.goals.filter(goal => goal.x != game.snake.head.x+1 && goal.y != game.snake.head.y))
        setGame('subLevel', game.subLevel+1)
        setGame('snake', 'length', (game.subLevel * game.subLevel * 3))
        if(game.subLevel >= 10) {
            setGame('gameStatus', 'won_level')
        }
    }


    // Remove Last Body Part Depending On Current and Assigned Length
    setGame('snake', 'body', (v:{x:number, y:number}[])=>[{x: game.snake.head.x, y: game.snake.head.y}, ...v])
    if(game.snake.body.length >= game.snake.length) {
        const last = game.snake.body[game.snake.body.length-1];
        setGame('snake', 'body', game.snake.body.slice(0, game.snake.body.length-1))
        setGame('grid', last.y, last.x, " ");
    }

    setGame('grid', game.snake.head.y, game.snake.head.x, "S");

}

export const resetLevel = (game: Game, setGame) => {
    clearBoard(game, setGame)
    setGame('subLevel', 0)
    setGame('commands', [])
    setGame('direction', "right")
    setGoals(game, setGame)
    setWalls(game, setGame)
    setObsticles(game, setGame)
    setSnake(game, setGame)   
}


// Monitor Keys and add them to the Snake Commands Queue
// Disallow Multiple Commands in the Same Direction
// Reset once all keys are released

export const handleKeys = (keys, game: Game, setGame) => {
    if(keys().length==0) {
        setGame('restrictedKeys', [])
        return
    } 

    for(let k of keys()) {
        if(game.restrictedKeys.includes(k.toString())) {
            continue
        }
        
        if(['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT'].includes(k.toString())) {
            setGame('restrictedKeys', [...game.restrictedKeys, k.toString()])
            setGame('commands', (v)=>[...v, k.toString() as ArrowKey])
        }
    }
}



export const runGameLoop = (game: Game, setGame) => {
    let clockSpeed;
    const loop = () => {
        clockSpeed = 50 + game.level

        if(game.gameStatus === "alive") {
            setDirection(game, setGame)
            advanceSnake(game, setGame);
            setTimeout(loop, clockSpeed)
            return
        }

        if(game.gameStatus === "dead") {
            setGame('lives', (l:number)=>l-1)
            resetLevel(game, setGame);
            setGame('gameStatus', "alive")
            setTimeout(loop, clockSpeed)
            return
        }

        if(game.gameStatus === "dying") {
            const delay = 5;
            game.snake.body.forEach((bodyPart, i) => {
                setTimeout(()=>setGame('grid', bodyPart.y, bodyPart.x, " "), i*delay)
            })
            setTimeout(()=>setGame('gameStatus', "dead"), game.snake.body.length*delay)
            setTimeout(loop, game.snake.body.length*delay)
            return
        }

        if(game.gameStatus === "won_level") {
            setGame('level', (l)=>l+1);
            resetLevel(game, setGame);
            
            setTimeout(()=>{
                setGame('gameStatus', "alive")
                setTimeout(loop, clockSpeed)
            }, 1000)
            return
        }


    }

    setTimeout(loop, 50)
}
