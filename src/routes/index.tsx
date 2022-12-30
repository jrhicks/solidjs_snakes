import { A } from "solid-start";
import { createStore } from "solid-js/store";
import { Show, createSignal, createEffect } from "solid-js";
import { newGame, runGameLoop, ArrowKey }  from "../stores/game";
import { useKeyDownList } from "@solid-primitives/keyboard";

import GameView from "../components/GameView";

export default function Home() {
  const [game, setGame] = createStore(newGame(35, 35))
  runGameLoop(game, setGame)
  const [restrictedKeys, setRestrictedKeys] = createSignal([])
  const [keys] = useKeyDownList();


  createEffect(() => {
    if(keys().length==0) {
      setRestrictedKeys([])
      return
    } 

    for(let k of keys()) {
      if(restrictedKeys().includes(k.toString())) {
        continue
      }
      
      if(['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT'].includes(k.toString())) {
        setRestrictedKeys([...restrictedKeys(), k.toString()])
        setGame('commands', (v)=>[...v, k.toString() as ArrowKey])
      }
    }
  })


  return (
    <main class="text-green-500 font-mono flex flex-col h-full">

      <div class="h-10" />
      
      <div class="px-6">
        <div class="max-w-3xl mx-auto flex flex-row">
          <div class="flex-grow">
            <h1 class="">SolidSnakes</h1>
            <p class="">A snake game written in SolidJS</p>
          </div>
          <div>
            Lives: {game.lives} <br />
            Level: {game.level} <br />
            Food: {game.subLevel} / 10 <br />
          </div>
        </div>
      </div>
      
      <div class="h-10" />

      <div class="px-6 flex-grow">
        <div class="max-w-3xl mx-auto h-full">
          <GameView game={game} />
        </div>
      </div>
      
      <div class="h-10" />
    </main>
  );
}
