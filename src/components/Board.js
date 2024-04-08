import { React,useState,useEffect } from 'react';
import '../App.css';
import BoardSquare from './BoardSquare';

export default function Board({board, PlayerColor}) {
    const [currBoard, setCurrBoard] = useState([]);

    useEffect(() => {
        setCurrBoard(
            PlayerColor === 'w' ? board.flat() : board.flat().reverse()
        );
    }, [board,PlayerColor]);
    function getXYPosition(i) {
        const x = PlayerColor === 'w' ? i % 8 : Math.abs((i % 8) - 7);
        const y = PlayerColor === 'w' ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
        return { x, y };
    }
    function isBlack(i) {
        const {x,y} = getXYPosition(i);
        return (x + y) % 2 === 1;
    }
    function getPosition(i){
        const {x,y} = getXYPosition(i);
        const letter = ['a','b','c','d','e','f','g','h'][x];
        return `${letter}${y + 1}`;
    }
    return (
        <div className="board">
            {currBoard.map((piece, i) => (
                <div key={i} className="square">
                    <BoardSquare 
                        piece={piece}
                        black={isBlack(i)}
                        position={getPosition(i)}
                    />
                </div>
            ))}
        </div>
    );
}