import { Index, Show } from 'solid-js'
import { type Game } from '../stores/game';
import { createTween } from '@solid-primitives/tween'


const GameView = (props: {game: Game}) => {
    
    const getBoardOpacity = createTween<number>( ()=>{return props.game.gameStatus === 'alive' ? 1 : 0}, {duration: 2000})
    const getSpin = createTween<number>( ()=> {return props.game.gameStatus === 'won_level' ? 360 : 0}, {duration: 2000})

    return (<>
        <Show when={props.game.gameStatus != 'won_level'}>
            <div class="h-full"
                style={{
                    opacity: `${getBoardOpacity()}`,
                }}>
                <BoardView game={props.game} />
            </div>
        </Show>
        <Show when={props.game.gameStatus == 'won_level'}>
            <WonLevelView game={props.game} getSpin={getSpin()} />
        </Show>
    </>)
}

const WonLevelView = (props: {game: Game, getSpin: number | void}) => {

    return (
        <div class="flex justify-center mt-20">
            <div class="border border-green-400 b-4 py-4 px-10"
                style={{
                    transform: `perspective(20em) rotatex(${Math.floor(props.getSpin || 0)}deg)`,
                }}>
                LEVEL {props.game.level}
            </div>
        </div>
    )
}


const BoardView = (props: {game: Game}) => {
    return (
        <div class="width-full h-full flex-grow flex flex-col">
            <Index each={props.game.grid}>{(row, i) => (
                <div class="flex-grow flex flex-row">
                    <Index each={row()}>{(cell, ii) => (
                        <div classList={{
                            "aspect-square": true,
                            "p-0 m-0 overflow-hidden": true,
                            "bg-green-400": cell() == "S",
                            "bg-green-500": cell() == "W",
                            "bg-green-300": cell() == "O",
                            "bg-cyan-600 rounded-full": cell() == "G",
                            }}>                           
                        </div>
                    )}</Index>
                </div>
            )}</Index>
        </div>
    )}

export default GameView