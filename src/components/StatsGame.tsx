'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Tile = {
  id: number;
  number: string;
  label: string;
  colorClass: string;
  freq: number;
};

const TILES: Tile[] = [
  { id: 0, number: '27', label: 'Years building', colorClass: 'tile-blue', freq: 329.63 },
  { id: 1, number: '6', label: 'Companies', colorClass: 'tile-cyan', freq: 440 },
  { id: 2, number: '1', label: 'Clean exit', colorClass: 'tile-green', freq: 554.37 },
  { id: 3, number: '1', label: 'Near IPO', colorClass: 'tile-purple', freq: 659.25 },
];

const HINT_TILE = 0;
const HINT_INTERVAL_MS = 20000;
const HINT_DURATION_MS = 1200;
const LONG_PRESS_MS = 1500;
const SEQUENCE_TILE_MS = 500;
const SEQUENCE_GAP_MS = 200;
const USER_FLASH_MS = 280;

type GameState =
  | 'dormant'
  | 'playing-sequence'
  | 'awaiting-input'
  | 'failed';

export default function StatsGame() {
  const [gameState, setGameState] = useState<GameState>('dormant');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [pressing, setPressing] = useState<number | null>(null);
  const [isActiveViewport, setIsActiveViewport] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Stats grid is the 2x2 game board only on mobile. Activate accordingly.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsActiveViewport(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsActiveViewport(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subtle hint pulse on the top-left tile every 20s, only when dormant on mobile
  useEffect(() => {
    if (gameState !== 'dormant' || !isActiveViewport) {
      setHintActive(false);
      return;
    }
    const interval = setInterval(() => {
      setHintActive(true);
      const t = setTimeout(() => setHintActive(false), HINT_DURATION_MS);
      return () => clearTimeout(t);
    }, HINT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameState, isActiveViewport]);

  // Apply a body-level fade variable so other sections recede as game advances.
  // Tag which section is the active board so CSS can keep that one at full opacity.
  useEffect(() => {
    const fade = gameState === 'dormant' ? 0 : Math.min(0.15 + round * 0.07, 0.6);
    document.body.style.setProperty('--game-fade', String(fade));
    if (gameState !== 'dormant') {
      document.body.dataset.gameActive = 'stats';
    } else if (document.body.dataset.gameActive === 'stats') {
      delete document.body.dataset.gameActive;
    }
    return () => {
      if (document.body.dataset.gameActive === 'stats') {
        document.body.style.removeProperty('--game-fade');
        delete document.body.dataset.gameActive;
      }
    };
  }, [gameState, round]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      sequenceTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const playTone = useCallback((freq: number) => {
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Audio is a nice-to-have; never block gameplay on it
    }
  }, []);

  const playSequence = useCallback(
    (seq: number[]) => {
      sequenceTimeoutsRef.current.forEach(clearTimeout);
      sequenceTimeoutsRef.current = [];
      seq.forEach((tileId, i) => {
        const onAt = i * (SEQUENCE_TILE_MS + SEQUENCE_GAP_MS) + 400;
        const offAt = onAt + SEQUENCE_TILE_MS;
        sequenceTimeoutsRef.current.push(
          setTimeout(() => {
            setHighlight(tileId);
            playTone(TILES[tileId].freq);
          }, onAt),
        );
        sequenceTimeoutsRef.current.push(
          setTimeout(() => setHighlight(null), offAt),
        );
      });
      const totalDur =
        seq.length * (SEQUENCE_TILE_MS + SEQUENCE_GAP_MS) + 400;
      sequenceTimeoutsRef.current.push(
        setTimeout(() => {
          setUserIndex(0);
          setGameState('awaiting-input');
        }, totalDur),
      );
    },
    [playTone],
  );

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * TILES.length);
    setRound(1);
    setSequence([first]);
    setUserIndex(0);
    setGameState('playing-sequence');
    playSequence([first]);
  }, [playSequence]);

  const advanceRound = useCallback(() => {
    setSequence((prev) => {
      const next = [...prev, Math.floor(Math.random() * TILES.length)];
      setRound(next.length);
      setUserIndex(0);
      setGameState('playing-sequence');
      playSequence(next);
      return next;
    });
  }, [playSequence]);

  const handleTap = useCallback(
    (tileId: number) => {
      if (gameState === 'failed') {
        startGame();
        return;
      }
      if (gameState !== 'awaiting-input') return;
      setHighlight(tileId);
      playTone(TILES[tileId].freq);
      setTimeout(() => setHighlight(null), USER_FLASH_MS);

      const expected = sequence[userIndex];
      if (tileId !== expected) {
        setGameState('failed');
        return;
      }
      const nextIndex = userIndex + 1;
      if (nextIndex >= sequence.length) {
        setTimeout(advanceRound, 700);
      } else {
        setUserIndex(nextIndex);
      }
    },
    [gameState, sequence, userIndex, startGame, advanceRound, playTone],
  );

  const handlePressStart = useCallback(
    (tileId: number) => {
      if (gameState !== 'dormant' || !isActiveViewport) return;
      setPressing(tileId);
      longPressTimerRef.current = setTimeout(() => {
        setPressing(null);
        startGame();
      }, LONG_PRESS_MS);
    },
    [gameState, isActiveViewport, startGame],
  );

  const handlePressEnd = useCallback(() => {
    setPressing(null);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const exitGame = useCallback(() => {
    sequenceTimeoutsRef.current.forEach(clearTimeout);
    sequenceTimeoutsRef.current = [];
    setGameState('dormant');
    setSequence([]);
    setUserIndex(0);
    setRound(0);
    setHighlight(null);
  }, []);

  return (
    <>
      <section className="stats" data-game={gameState}>
        {TILES.map((tile) => {
          const isHighlighted = highlight === tile.id;
          const isHint = hintActive && tile.id === HINT_TILE && gameState === 'dormant';
          const isPressing = pressing === tile.id;
          const classes = [
            'stat',
            tile.colorClass,
            isHighlighted && 'is-lit',
            isHint && 'is-hint',
            isPressing && 'is-pressing',
            gameState !== 'dormant' && 'in-game',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <div
              key={tile.id}
              className={classes}
              onMouseDown={() => handlePressStart(tile.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(tile.id)}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressEnd}
              onClick={() => handleTap(tile.id)}
            >
              <div className="stat-number">{tile.number}</div>
              <div className="stat-label">{tile.label}</div>
            </div>
          );
        })}
      </section>

      {gameState !== 'dormant' && (
        <div className="game-status" aria-live="polite">
          {gameState === 'failed' ? (
            <>
              <span className="game-status-msg">
                Game over. You reached round {round}.
              </span>
              <button
                type="button"
                className="game-status-action"
                onClick={startGame}
              >
                Play again
              </button>
              <button
                type="button"
                className="game-status-action game-status-exit"
                onClick={exitGame}
              >
                Exit
              </button>
            </>
          ) : (
            <>
              <span className="game-status-msg">Round {round}</span>
              <button
                type="button"
                className="game-status-action game-status-exit"
                onClick={exitGame}
              >
                Exit
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
