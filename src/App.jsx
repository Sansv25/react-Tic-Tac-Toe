import { useState } from 'react'
import './index.css'

function Square({ value, onClick, isWinningSquare }) {
  return (
    <button
      className={`square-btn ${value === 'X' ? 'square-x' : 'square-o'} ${isWinningSquare ? 'bg-indigo-500/20 border-indigo-500/50 scale-105' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const { winner, line } = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(s => s !== null)) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`text-2xl font-bold px-6 py-2 rounded-full glass-panel ${winner ? 'text-indigo-400 animate-bounce' : 'text-slate-300'}`}>
        {status}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Square
            key={i}
            value={squares[i]}
            onClick={() => handleClick(i)}
            isWinningSquare={line?.includes(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    const isCurrent = move === currentMove;

    return (
      <li key={move} className="mb-2">
        <button
          onClick={() => jumpTo(move)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-all ${isCurrent
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <h1 className="text-5xl font-black mb-12 bg-linear-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
        TIC TAC TOE
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full max-w-5xl">
        <div className="glass-panel p-8 rounded-3xl w-full lg:w-auto">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>

        <div className="glass-panel p-8 rounded-3xl w-full lg:w-80 shrink-0">
          <h2 className="text-xl font-bold mb-6 text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            History
          </h2>
          <ul className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {moves}
          </ul>
        </div>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}