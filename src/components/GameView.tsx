import { Index, Show } from "solid-js";
import { type Game } from "../stores/game";
import { createTween } from "@solid-primitives/tween";
import ConfettiExplosion from "solid-confetti-explosion";

const GameView = (props: { game: Game }) => {
  const getBoardOpacity = createTween<number>(
    () => {
      return props.game.gameStatus === "alive" ? 1 : 0;
    },
    { duration: 2000 }
  );
  const getSpin = createTween<number>(
    () => {
      return props.game.gameStatus === "won_level" ? 360 : 0;
    },
    { duration: 2000 }
  );

  return (
    <>
      <Show when={props.game.gameStatus != "won_level"}>
        <div
          class="h-full"
          style={{
            opacity: `${getBoardOpacity()}`,
          }}
        >
          <BoardView game={props.game} />
        </div>
      </Show>
      <Show when={props.game.gameStatus == "won_level"}>
        <WonLevelView game={props.game} getSpin={getSpin()} />
      </Show>
    </>
  );
};

const WonLevelView = (props: { game: Game; getSpin: number | void }) => {
  return (
    <div class="flex flex-col h-full">
      <div class="flex justify-center mt-20">
        <div
          class="border border-green-400 b-4 py-4 px-10"
          style={{
            transform: `perspective(20em) rotatex(${Math.floor(
              props.getSpin || 0
            )}deg)`,
          }}
        >
          LEVEL {props.game.level}
        </div>
      </div>
      <Show when={props.game.gameStatus === "won_level"}>
        <div class="mx-auto my-20">
            <ConfettiExplosion particleCount={200} force={0.8} />
        </div>
      </Show>
    </div>
  );
};

const BoardView = (props: { game: Game }) => {
  return (
    <div class="w-full h-full flex-grow flex flex-col">
      <Index each={props.game.grid}>
        {(row, i) => (
          <div class="flex-grow flex flex-row">
            <Index each={row()}>
              {(cell, ii) => (
                <div
                  classList={{
                    "flex-grow": true,
                    "p-0 m-0 overflow-hidden": true,
                    "bg-cyan-600": cell() == "S" && [0].includes(props.game.strength),
                    "bg-cyan-500": cell() == "S" && [1,2].includes(props.game.strength),
                    "bg-cyan-400": cell() == "S" && [3].includes(props.game.strength),
                    "bg-cyan-300": cell() == "S" && [4,5].includes(props.game.strength),
                    "bg-cyan-200": cell() == "S" && [6,7].includes(props.game.strength),
                    "bg-cyan-100": cell() == "S" && [8,9].includes(props.game.strength),
                    "bg-white": cell() == "S" && [10].includes(props.game.strength),
                    "bg-green-500": cell() == "W",
                    "bg-green-300": cell() == "O",
                    "outline outline-cyan-100 bg-cyan-400 rounded-full": cell() == "G",
                  }}
                ></div>
              )}
            </Index>
          </div>
        )}
      </Index>
    </div>
  );
};

export default GameView;
