import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette from requirements
const PALETTE = {
  primary: "#1976d2",
  secondary: "#ffffff",
  accent: "#ff5722",
};

// Utility function for winner calculation
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // 'X' or 'O'
    }
  }
  return null;
}

function getResult(squares) {
  const winner = calculateWinner(squares);
  if (winner) {
    return { winner, draw: false };
  }
  const draw = squares.every(Boolean);
  return { winner: null, draw };
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Individual cell of the tic tac toe board. */
  return (
    <button
      className="ttt-square"
      style={highlight ? { color: PALETTE.accent, borderColor: PALETTE.accent } : {}}
      onClick={onClick}
      aria-label={value || "empty"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  /** The rendered 3x3 game board. */
  function isWinningSquare(idx) {
    return winningLine && winningLine.includes(idx);
  }
  return (
    <div className="ttt-board">
      {squares.map((sq, i) => (
        <Square
          key={i}
          value={sq}
          highlight={isWinningSquare(i)}
          onClick={() => onSquareClick(i)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Main tic tac toe app, handles state, game logic, and UI. */
  const [theme, setTheme] = useState("light");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winnerLine, setWinnerLine] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setGameOver(true);
      // Save winning line for highlighting
      setWinnerLine(
        [
          [0,1,2],[3,4,5],[6,7,8],
          [0,3,6],[1,4,7],[2,5,8],
          [0,4,8],[2,4,6]
        ].find(
          ([a, b, c]) =>
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) || null
      );
    } else if (squares.every(Boolean)) {
      setGameOver(true);
      setWinnerLine(null);
    } else {
      setGameOver(false);
      setWinnerLine(null);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (squares[idx] || gameOver) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setHistory((h) => [...h, squares]);
    setXIsNext((x) => !x);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setHistory([]);
    setGameOver(false);
    setWinnerLine(null);
  };

  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  let status;
  if (winner) {
    status = (
      <span>
        Winner:{" "}
        <span style={{ color: PALETTE.accent, fontWeight: 600 }}>{winner}</span>
      </span>
    );
  } else if (isDraw) {
    status = <span>Draw! 🤝</span>;
  } else {
    status = (
      <>
        Current Player:&nbsp;
        <span
          style={{
            color: xIsNext ? PALETTE.primary : PALETTE.accent,
            fontWeight: 600,
          }}
        >
          {xIsNext ? "X" : "O"}
        </span>
      </>
    );
  }

  return (
    <div className="App">
      <header className="App-header" style={{ background: "var(--bg-secondary)" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1 className="ttt-title" style={{ color: PALETTE.primary }}>
          Tic Tac Toe
        </h1>
        <div
          style={{
            minHeight: 24,
            marginBottom: 24,
            color: "var(--text-primary)",
            fontSize: "1.1rem",
            fontFamily: "inherit",
          }}
        >
          {status}
        </div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winnerLine}
        />
        <button className="ttt-reset-btn" onClick={handleRestart}>
          Restart Game
        </button>
        <footer className="ttt-footer">
          <span style={{ color: "var(--text-secondary)", fontSize: 13, opacity: 0.6 }}>
            Modern, minimal &middot; React &middot; Kavia
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
