import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Github, Flame, Droplets } from 'lucide-react';

type Player = '🔥' | '💧' | null;
type BoardState = Player[];

function App() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isFireNext, setIsFireNext] = useState(true);
  const [winner, setWinner] = useState<Player>(null);
  const [scores, setScores] = useState({ '🔥': 0, '💧': 0 });
  const [lastPlayed, setLastPlayed] = useState<number | null>(null);

  const calculateWinner = (squares: BoardState): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    const currentPlayer = isFireNext ? '🔥' : '💧';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setLastPlayed(index);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }));
    } else {
      setIsFireNext(!isFireNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsFireNext(true);
    setWinner(null);
    setLastPlayed(null);
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    const isWinningSquare = winner && value === winner;

    return (
      <button
        onClick={() => handleClick(index)}
        className={`relative w-full h-24 text-5xl font-bold transition-all duration-300
          ${!value && !winner ? 'hover:bg-opacity-20 hover:bg-white' : ''} 
          ${value ? 'cursor-not-allowed' : 'cursor-pointer'}
          rounded-lg overflow-hidden
          ${value === '🔥' ? 'fire-cell' : value === '💧' ? 'water-cell' : 'empty-cell'}
          ${lastPlayed === index ? 'animate-pop' : ''}
          ${isWinningSquare ? 'winning-cell' : ''}
          transform hover:scale-[1.02] backdrop-blur-sm`}
      >
        {value && (
          <>
            <div className="absolute inset-0 opacity-20 animate-pulse" />
            <div className="relative z-10">{value}</div>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-600 to-blue-500 animate-gradient-shift flex flex-col items-center py-8 px-4">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }
        .fire-cell {
          background: linear-gradient(45deg, #ff4e50, #f9d423);
          box-shadow: 0 0 15px rgba(255, 78, 80, 0.5);
        }
        .water-cell {
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          box-shadow: 0 0 15px rgba(79, 172, 254, 0.5);
        }
        .empty-cell {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
        .winning-cell {
          animation: winner-pulse 1.5s ease-in-out infinite;
        }
        .animate-pop {
          animation: pop 0.3s ease-out;
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes winner-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white text-shadow">Elements Battle</h1>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>

        <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-lg ${isFireNext ? 'fire-cell' : 'water-cell'}`}>
                <div className="flex items-center gap-2">
                  {isFireNext ? (
                    <Flame className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <Droplets className="w-6 h-6 text-white animate-pulse" />
                  )}
                  <span className="text-xl font-bold text-white">
                    {winner ? (winner === '🔥' ? "Fire Wins!" : "Water Wins!") : 
                     isFireNext ? "Fire's Turn" : "Water's Turn"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
              title="Reset Game"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array(9).fill(null).map((_, i) => (
              <div key={i}>{renderSquare(i)}</div>
            ))}
          </div>

          {winner && (
            <div className={`text-center p-6 rounded-lg ${winner === '🔥' ? 'fire-cell' : 'water-cell'}`}>
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-xl font-bold text-white">
                {winner === '🔥' ? 'Fire' : 'Water'} Triumphs!
              </p>
            </div>
          )}

          {!winner && board.every(Boolean) && (
            <div className="text-center p-6 bg-white bg-opacity-10 rounded-lg">
              <p className="text-xl font-bold text-white">Elements in Balance!</p>
            </div>
          )}
        </div>

        <div className="backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-white">Battle Records</h2>
          <div className="flex justify-between gap-4">
            <div className="text-center p-4 fire-cell rounded-lg flex-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-white" />
                <p className="text-sm text-white">Fire Victories</p>
              </div>
              <p className="text-3xl font-bold text-white">{scores['🔥']}</p>
            </div>
            <div className="text-center p-4 water-cell rounded-lg flex-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-white" />
                <p className="text-sm text-white">Water Victories</p>
              </div>
              <p className="text-3xl font-bold text-white">{scores['💧']}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;