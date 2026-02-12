import './GameBoard.css';

function GameBoard({ board, onCellClick, disabled, winningLine }) {
  const renderCell = (index) => {
    const value = board[index];
    const isWinning = winningLine && winningLine.includes(index);

    return (
      <button
        key={index}
        className={`cell ${value ? 'filled' : ''} ${
          isWinning ? 'winning' : ''
        }`}
        onClick={() => onCellClick(index)}
        disabled={disabled || value}
      >
        {value && (
          <span className={`cell-value ${value === 'X' ? 'x-mark' : 'o-mark'}`}>
            {value}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="game-board">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(renderCell)}
    </div>
  );
}

export default GameBoard;
