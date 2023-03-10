import { type SetStoreFunction } from 'solid-js/store';

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
    restrictedKeys: ArrowKey[];
    strength: number;
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

    return { 
        width: width,
        height: height,
        grid: grid,
        gameStatus: "dead",
        direction: "right",
        lives: 100,
        level: 1,
        subLevel: 1,
        commands: [],
        obsticles: [],
        goals: [],
        restrictedKeys: [],
        strength: 1
    }
}

export const clearBoard = (game: Game, setGame: SetStoreFunction<Game>) => {
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            setGame('grid', y, x, " ");
        }
    }
}

export const setWalls = (game: Game, setGame: SetStoreFunction<Game>) => {
    for (let y = 0; y < game.height; y++) {
        for (let x = 0; x < game.width; x++) {
            if(y==0 || y==game.height-1 || x==0 || x==game.width-1){
                setGame('grid', y, x, "W");               
            }
        }
    }
}

export const setSnake = (game: Game, setGame: SetStoreFunction<Game>) => {
    const x = 2
    const y = Math.floor(game.height/2);
    setGame('direction', 'right')
    setGame('grid', y, x, "S");
    setGame('snake', {
        head: { x, y },
        body: [{x, y}],
        length: 1
    });
}    

export const canObsticleOccupy = (game: Game, x: number, y: number) => {
    // Keep obsticles off center
    if (y == Math.floor(game.height / 2)) {
        return false;
    }
    // Permit obsticles to be placed on empty space
    if (game.grid[y][x] === " ") {
        return true;
    }

    return false;
}

export const randomObsticlePoint = (game: Game) => {
    while (true) {
        const x = Math.floor(Math.random() * (game.width-2))+1;
        const y = Math.floor(Math.random() * (game.height-2))+1;
        if (canObsticleOccupy(game, x, y)) {
            return { x, y };
        }
    }
}

export const setObsticles = (game: Game, setGame: SetStoreFunction<Game> ) => {
    for(let i=0; i<game.level*3; i++) {
        const {x, y} = randomObsticlePoint(game);
        setGame('grid', y, x, "O");
    }
}

export const canGoalOccupy = (game: Game, x: number, y: number) => {
    // Permit goal to be placed on empty space
    if (game.grid[y][x] === " ") {
        return true;
    }

    return false;
}

export const randomGoalPoint = (game: Game) => {
    while (true) {
        const x = Math.floor(Math.random() * (game.width-2))+1;
        const y = Math.floor(Math.random() * (game.height-2))+1;
        if (canGoalOccupy(game, x, y)) {
            return { x, y };
        }
    }
}

export const setGoals = (game: Game, setGame: SetStoreFunction<Game>) => {
    for(let i=0; i<10; i++) {
        const {x, y} = randomGoalPoint(game);
        setGame('grid', y, x, "G");
        setGame('goals', game.goals.concat({x, y}))
    }
}

export const setDirection = (game: Game, setGame: SetStoreFunction<Game>) => {
    if(game.commands.length > 0) {
        const command = game.commands[0];
        if(command == "ARROWUP" && game.direction != "down") {
            if(game.strength > 0 ) {
                let space = game.grid[game.snake.head.y-1][game.snake.head.x];
                if(space == "W" || space == "O" || space == "S") {
                    setGame('strength', (v) => v-1)
                    return
                }    
            }
            setGame('direction', "up");
            setGame('commands', game.commands.slice(1))
            return
        } else if(command == "ARROWDOWN" && game.direction != "up") {
            if(game.strength > 0) {
                let space = game.grid[game.snake.head.y+1][game.snake.head.x];
                if(space == "W" || space == "O" || space == "S") {
                    setGame('strength', (v) => v-1)
                    return
                }    
            }
            setGame('direction', "down");
            setGame('commands', game.commands.slice(1))
            return
        } else if(command == "ARROWLEFT" && game.direction != "right") {
            if(game.strength > 0) {
                let space = game.grid[game.snake.head.y][game.snake.head.x-1];
                if(space == "W" || space == "O" || space == "S") {
                    setGame('strength', (v) => v-1)
                    return
                }    
            }
            setGame('direction', "left");
            setGame('commands', game.commands.slice(1))
            return
        } else if(command == "ARROWRIGHT" && game.direction != "left") {
            if(game.strength > 0) {
                let space = game.grid[game.snake.head.y][game.snake.head.x+1];
                if(space == "W" || space == "O" || space == "S") {
                    setGame('strength', (v) => v-1)
                    return
                }    
            }
            setGame('direction', "right");
            setGame('commands', game.commands.slice(1))
            return
        }
        
        // They must be trying to do a 180, so ignore the command
        setGame('commands', game.commands.slice(1))
    }
}

export const nextHead = (head, direction) => {
    if(direction == "right") {
        return {x: head.x+1, y: head.y}
    }
    if(direction == "left") {
        return {x: head.x-1, y: head.y}
    }
    if(direction == "up") {
        return {x: head.x, y: head.y-1}
    }
    if(direction == "down") {
        return {x: head.x, y: head.y+1}
    }
}

export const advanceSnake = (game: Game, setGame: SetStoreFunction<Game>) => {    
    if(game.strength > 0) {
        let h = nextHead(game.snake.head, game.direction);
        let s = game.grid[h.y][h.x];
        if(s == "W" || s == "O" || s == "S") {
            setGame('strength', (v) => v-1)
            return
        }
    }

    if(game.direction == "right") {
        setGame('snake', 'head', 'x', (v) => v+1);
    }
    if(game.direction == "left") {
        setGame('snake', 'head', 'x', (v) => v-1);
    }
    if(game.direction == "up") {
        setGame('snake', 'head', 'y', (v) => v-1);
    }
    if(game.direction == "down") {
        setGame('snake', 'head', 'y', (v) => v+1);
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
        setGame('subLevel', (v)=>v+1)
        setGame('strength', (v)=>v+1)
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

export const resetLevel = (game: Game, setGame: SetStoreFunction<Game>) => {
    clearBoard(game, setGame)
    setGame('subLevel', 0)
    setGame('commands', [])
    setGame('strength', 1)
    setGoals(game, setGame)
    setWalls(game, setGame)
    setObsticles(game, setGame)
    setSnake(game, setGame)   
}


// Monitor Keys and add them to the Snake Commands Queue
// Disallow Multiple Commands in the Same Direction
// Reset once all keys are released

export const handleKeys = (keys, game: Game, setGame: SetStoreFunction<Game>) => {
    
    // Remove restrictions any time a key is released
    for(let k of game.restrictedKeys) {
        if(!keys().includes(k)) {
            setGame('restrictedKeys', game.restrictedKeys.filter(v=>v!=k))
        }
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



export const runGameLoop = (game: Game, setGame: SetStoreFunction<Game>) => {
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
