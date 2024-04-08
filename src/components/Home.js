import {React, useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";
import Board from "./Board";
import { gameSubject,initGame, resetGame } from './Game';

import io from "socket.io-client";

const socket = io("http://localhost:3001", {transports: ['websocket']});

const Home = ()=>{
    const {logOut,user} = useUserAuth();
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [board, setBoard] = useState([]);
    const [isGameOver, setIsGameOver] = useState();
    const [result, setResult] = useState();
    const [PlayerColor, setPlayerColor] = useState('');
    // const [turn,setTurn] = useState();
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
    
    const navigate = useNavigate();
    const handleLogout = async() => {
        try{
            await logOut();
            navigate("/");
        }
        catch(err){
            console.log(err.message);
        }
    };

    const createRoom = () => {
        socket.emit('createRoom');
    }

    const joinRoom = () => {
        socket.emit('joinRoom', { roomId });
    }

    useEffect(() => {
        socket.on('room-created', ({ roomID }) => {
            setRoomId(roomID);
        });

        socket.on('room-joined', ({ roomID, color}) => {
            setRoomId(roomID);
            if(!PlayerColor) setPlayerColor(color);
            setIsInRoom(true);
        });

        socket.on('room-full', ({ message }) => {
            setError(message);
        });

        socket.on('room-not-found', ({ message }) => {
            setError(message);
        });

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        return () => {
            // Clean up event listeners
            socket.off('room-created');
            socket.off('room-joined');
            socket.off('room-full');
            socket.off('room-not-found');
            socket.off('counterUpdated');
            socket.off('connect');
        };
    }, [PlayerColor]);

    return (
      <>
            <div>
                    Welcome <br/> {user && user.displayName ? user.displayName : user.email}
            </div>
            <div>
                <Button variant={"primary"} onClick={handleLogout}>Log out</Button>
            </div>
            <div>
                {!isInRoom && (
                    <>
                    <button onClick={createRoom}>Create Room</button>
                    {roomId && <p>Room ID: {roomId}</p>}
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                    />
                    <button onClick={joinRoom}>Join Room</button>
                    {error && <p>{error}</p>}
                    </>
                )}
                {isInRoom && (
                    <div>
                    <div className="container">
                        {isGameOver && (
                            <h2 className="vert-text"> GAME OVER 
                                <button onClick={()=>resetGame()} className="new-game"><span>NEW GAME</span></button>
                            </h2>
                        )}
                        {!isGameOver && <button onClick={()=>resetGame()} className="new-game margin"><span>NEW GAME</span></button>}
                        <div className="board-container">
                            <Board board = {board} PlayerColor={PlayerColor}/>
                        </div>
                        {result && <p className="result-text">{result}</p>}
                    </div>
                    <p>Room ID: {roomId}</p>
                    </div>
                )}
            </div>
      </>
    );
};

export default Home;