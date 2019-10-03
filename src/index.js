import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
    <button className={props.className} onClick={props.onClick}>
        {props.value}
    </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        const className = 'square' + (this.props.highlight.includes(i) ? ' highlight' : '');
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                className={className}
            />
        );
    }

    render() {
        let render = [];
        let c = 0;
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++){
                row.push(this.renderSquare(c));
                c++;
            }
            render.push(
                <div key={i} className="board-row">
                {row}
                </div>
            );
        }

        return (
        <div>
            {render}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: null
            }],
            stepNumber: 0,
            xIsNext: true,
            isDescending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winningCases = calculateWinner(squares);
        if (winningCases || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: getPosition(i),
                stepNumber: history.length
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    handleReverse(){
        this.setState({
            isDescending: !this.state.isDescending
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const win = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = step.stepNumber ?
            'Revenir au tour n°' + step.stepNumber + ' [' + step.position + ']':
            ' Revenir au début de la partie';
        
            let renderStep = (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
            if(move === this.state.stepNumber){
                renderStep = (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
                    </li>
                );
            }
            return renderStep
        });

        let status;
        let toHighlight = [];
        if (win){
            status = win.winner + ' won !';
            toHighlight = win.line
        } else if (!current.squares.includes(null)){
            status = "Draw !"
        } else {
            status = 'Next player : ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                highlight={toHighlight}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
            <ol>
                <button onClick={() => this.handleReverse()}>
                Reverse
                </button>
            </ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            
            return {
                winner: squares[a],
                line: lines[i]
            }
        }
    }
    return null;
}

function getPosition(i) {
    const positions = [
        [0,0],
        [1,0],
        [2,0],
        [0,1],
        [1,1],
        [2,1],
        [0,2],
        [1,2],
        [2,2]
    ];
    return positions[i];
}