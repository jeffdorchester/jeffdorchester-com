'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Tile = {
  id: number;
  name: string;
  items: string[];
  color: string;
  freq: number;
};

const TILES: Tile[] = [
  {
    id: 0,
    name: 'Compliance',
    items: [
      'SOC 2',
      'HIPAA-conformant programs',
      'CIS Critical Security Controls',
      'Internal-audit operationalization',
      'Public-facing transparency',
    ],
    color: '#3b82f6',
    freq: 329.63,
  },
  {
    id: 1,
    name: 'Cloud & infrastructure',
    items: [
      'Microsoft Azure (compute, identity, data)',
      'Endpoint management',
      'Observability and monitoring',
      'Public-facing status pages',
      'Identity and access',
    ],
    color: '#06b6d4',
    freq: 440,
  },
  {
    id: 2,
    name: 'Product engineering',
    items: [
      'Mobile (iOS, Android, Xamarin, Flutter, Ionic)',
      'Custom APIs and integrations',
      'Multi-tenant white-label platforms',
      'Regulated SaaS',
      'Full-stack web',
    ],
    color: '#22c55e',
    freq: 554.37,
  },
  {
    id: 3,
    name: 'Founder operations',
    items: [
      'Bootstrapping discipline',
      'M&A execution (one closed exit)',
      'IPO-readiness exposure',
      'Strategic-partnership development',
      'Board and exec engagement',
    ],
    color: '#8b5cf6',
    freq: 659.25,
  },
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

export default function CapabilitiesGame() {
  const [gameState, setGameState] = useState<GameState>('dormant');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [pressing, setPressing] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Subtle hint pulse on the top-left tile every 20s, only when dormant
  useEffect(() => {
    if (gameState !== 'dormant') {
      setHintActive(false);
      return;
    }
    const interval = setInterval(() => {
      setHintActive(true);
      const t = setTimeout(() => setHintActive(false), HINT_DURATION_MS);
      return () => clearTimeout(t);
    }, HINT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameState]);

  // Apply a body-level fade variable so other sections recede as game advances
  useEffect(() => {
    const fade = gameState === 'dormant' ? 0 : Math.min(0.15 + round * 0.07, 0.6);
    document.body.style.setProperty('--game-fade', String(fade));
    document.body.dataset.gameActive = gameState === 'dormant' ? 'false' : 'true';
    return () => {
      document.body.style.removeProperty('--game-fade');
      delete document.body.dataset.gameActive;
    };
  }, [gameState, round]);

  // Cleanup any pending timers on unmount
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
        // tap-to-restart from failed state
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
      if (gameState !== 'dormant') return;
      setPressing(tileId);
      longPressTimerRef.current = setTimeout(() => {
        setPressing(null);
        startGame();
      }, LONG_PRESS_MS);
    },
    [gameState, startGame],
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
    <section className="capabilities" data-game={gameState}>
      <h2>Capabilities</h2>
      <div className="cap-grid" role="presentation">
        {TILES.map((tile) => {
          const isHighlighted = highlight === tile.id;
          const isHint = hintActive && tile.id === HINT_TILE && gameState === 'dormant';
          const isPressing = pressing === tile.id;
          const style = {
            ['--tile-color' as string]: tile.color,
          } as CSSProperties;
          const classes = [
            'cap-block',
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
              style={style}
              onMouseDown={() => handlePressStart(tile.id)}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={() => handlePressStart(tile.id)}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressEnd}
              onClick={() => handleTap(tile.id)}
            >
              <h3>{tile.name}</h3>
              <ul>
                {tile.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

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
    </section>
  );
}
