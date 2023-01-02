import { A } from "solid-start";
import { createStore } from "solid-js/store";
import { createSignal, createEffect } from "solid-js";
import { newGame, runGameLoop, handleKeys }  from "../stores/game";
import { useKeyDownList } from "@solid-primitives/keyboard";

import GameView from "../components/GameView";

export default function Home() {
  const [game, setGame] = createStore(newGame(30, 30))
  const [keys] = useKeyDownList();

  runGameLoop(game, setGame)
  createEffect(() => {
    handleKeys(keys, game, setGame)
  })

  return (
    <main class="text-green-500 font-mono flex flex-col h-full">
      
      <div class="h-2 sm:h-10" />
      
      <div class="px-6">
        <div class="max-w-xl mx-auto flex flex-row">
          <div class="flex-grow">
            <h1 class="font-bold">SolidSnakes</h1>
            <p class="hidden sm:block">A snake game written in SolidJS</p>
          </div>
          <div>
            <div>Lives: {game.lives}</div>
            <div class="hidden sm:block">Level: {game.level}</div>
            <div class="hidden sm:block">Food: {game.subLevel} / 10</div>
          </div>
        </div>
      </div>
      
      <div class="h-2 sm:h-10" />

      <div class="px-6 flex-grow">
        <div class="max-w-xl mx-auto h-full">
          <GameView game={game} />
        </div>
      </div>
      
      <div class="h-2 sm:h-10" />

      <div class="hidden sm:block px-6">
        <div class="max-w-xl mx-auto flex">
          <p class="flex-grow">Github: <a class="underline" href="https://github.com/jrhicks/solidjs_snakes">jrhicks/solidjs_snakes</a></p>
          <p class="">Follow: <a class="underline" href="https://twitter.com/jrhicks">@jrhicks</a></p>
        </div>
      </div>
      
      <div class="h-2 sm:h-5" />

    </main>
  );
}
