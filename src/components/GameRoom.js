import {React,useState,useEffect,createContext} from 'react';
import {resetGame,PlayerTurn} from './Game';
import Board from './Board';
import { gameSubject,initGame} from './Game';

const Color = createContext();

export default function GameRoom({PlayerColor,roomId}) {
    const [board, setBoard] = useState([]);
    const [isGameOver, setIsGameOver] = useState();
    const [result, setResult] = useState();
    useEffect(() => {
        initGame()
        const subscribe = gameSubject.subscribe((game) => {
            setBoard(game.board);
            setIsGameOver(game.isGameOver);
            setResult(game.result);
            // setTurn(game.turn);
        });
        return () => subscribe.unsubscribe();
    },[]);

    const [isCopied, setIsCopied] = useState(false);
    const CopyToClipboard = () => {
        navigator.clipboard.writeText(roomId)
        .then(() => {
            setIsCopied(true);
            setTimeout(()=>{setIsCopied(false)}, 1500);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className="roomId">
                <p>Room ID: {roomId}</p>
                {isCopied === false ? 
                    (<i class="fa-regular fa-copy copy" onClick={CopyToClipboard}></i>)
                    : (<><i class="fa-solid fa-check"></i></>)
                }
            </div>
            <div className="container">
                {isGameOver && (
                    <h2 className="vert-text"> GAME OVER 
                        <button onClick={()=>resetGame()} className="new-game"><span>NEW GAME</span></button>
                    </h2>
                )}
                {!isGameOver && <button onClick={()=>resetGame()} className="new-game margin"><span>NEW GAME</span></button>}
                <div className="board-container">
                    <Color.Provider value={PlayerColor}>
                        <Board board = {board}/>
                    </Color.Provider>
                    {!result && <p className="status">Status: {PlayerTurn()} Player's Turn</p>}
                </div>
                {result && <p className="result-text">{result}</p>}
            </div>
        </div>
    )
}

export {Color};