import React, { useState } from 'react';
import './App.css';

const GRID_SIZE = 5;

const Dot = () => (
  <div className="dot"></div>
);

const Line = ({ onClick, isHorizontal, owner }) => (
  <div
    className={`line ${isHorizontal ? 'horizontal' : 'vertical'} ${owner}`}
    onClick={onClick}
  ></div>
);

const Box = ({ owner }) => (
  <div className={`box ${owner}`}></div>
);

const App = () => {
  const [horizontalLines, setHorizontalLines] = useState(
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE - 1).fill(null))
  );
  const [verticalLines, setVerticalLines] = useState(
    Array(GRID_SIZE - 1).fill().map(() => Array(GRID_SIZE).fill(null))
  );
  const [boxes, setBoxes] = useState(
    Array(GRID_SIZE - 1).fill().map(() => Array(GRID_SIZE - 1).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const handleLineClick = (isHorizontal, row, col) => {
    if (isHorizontal) {
      if (horizontalLines[row][col]) return;
      const newLines = horizontalLines.map((lineRow, i) =>
        lineRow.map((line, j) => (i === row && j === col ? currentPlayer : line))
      );
      setHorizontalLines(newLines);
    } else {
      if (verticalLines[row][col]) return;
      const newLines = verticalLines.map((lineRow, i) =>
        lineRow.map((line, j) => (i === row && j === col ? currentPlayer : line))
      );
      setVerticalLines(newLines);
    }
    checkForCompletedBoxes(isHorizontal, row, col);
    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const checkForCompletedBoxes = (isHorizontal, row, col) => {
    let newBoxes = [...boxes];
    let scoreIncrement = 0;

    if (isHorizontal) {
      if (row > 0 && horizontalLines[row - 1][col] && verticalLines[row - 1][col] && verticalLines[row - 1][col + 1]) {
        newBoxes[row - 1][col] = currentPlayer;
        scoreIncrement++;
      }
      if (row < GRID_SIZE - 1 && horizontalLines[row + 1][col] && verticalLines[row][col] && verticalLines[row][col + 1]) {
        newBoxes[row][col] = currentPlayer;
        scoreIncrement++;
      }
    } else {
      if (col > 0 && verticalLines[row][col - 1] && horizontalLines[row][col - 1] && horizontalLines[row + 1][col - 1]) {
        newBoxes[row][col - 1] = currentPlayer;
        scoreIncrement++;
      }
      if (col < GRID_SIZE - 1 && verticalLines[row][col + 1] && horizontalLines[row][col] && horizontalLines[row + 1][col]) {
        newBoxes[row][col] = currentPlayer;
        scoreIncrement++;
      }
    }

    setBoxes(newBoxes);
    if (scoreIncrement > 0) {
      setScores({ ...scores, [currentPlayer]: scores[currentPlayer] + scoreIncrement });
    }
  };

  return (
    <div className="app">
      <h1>Connect the Dots</h1>
      <div className="scores">
        <div>Player 1: {scores.player1}</div>
        <div>Player 2: {scores.player2}</div>
      </div>
      <div className="grid">
        {Array(GRID_SIZE * 2 - 1).fill().map((_, row) => (
          <div className="row" key={row}>
            {Array(GRID_SIZE * 2 - 1).fill().map((_, col) => {
              if (row % 2 === 0 && col % 2 === 0) {
                return <Dot key={col} />;
              } else if (row % 2 === 0) {
                return (
                  <Line
                    key={col}
                    isHorizontal
                    owner={horizontalLines[row / 2][(col - 1) / 2]}
                    onClick={() => handleLineClick(true, row / 2, (col - 1) / 2)}
                  />
                );
              } else if (col % 2 === 0) {
                return (
                  <Line
                    key={col}
                    owner={verticalLines[(row - 1) / 2][col / 2]}
                    onClick={() => handleLineClick(false, (row - 1) / 2, col / 2)}
                  />
                );
              } else {
                return <Box key={col} owner={boxes[(row - 1) / 2][(col - 1) / 2]} />;
              }
            })}
          </div>
        ))}
      </div>
      <div>Current Turn: {currentPlayer}</div>
    </div>
  );
};

export default App;
