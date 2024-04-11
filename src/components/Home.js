import {React, useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";
// import Board from "./Board";



import io from "socket.io-client";

const socket = io("https://chess-backend-c82w.onrender.com", {transports: ['websocket']});

const Home = ()=>{
    const {logOut,user} = useUserAuth();
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
    const [PlayerColor, setPlayerColor] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    // const [turn,setTurn] = useState();
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

    const joinRoom = () => {
        socket.emit('joinRoom', { roomId });
        // socket.emit('room-id', { roomId });
    }

    useEffect(() => {
        socket.on('room-created', ({ roomID }) => {
            setRoomId(roomID);
        });

        socket.on('room-joined', ({ roomID, color}) => {
            setRoomId(roomID);
            if(!PlayerColor) setPlayerColor(color);
            setIsInRoom(true);
            // navigateToGameRoute(roomID,color);
            navigate(`/game/${roomID}/${color}`);
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
    }, [PlayerColor,navigate]);

    return (
      <>    
            
            <div className="user-info">
                <div className="user-name">
                        Welcome {user && user.displayName ? user.displayName : user.email}
                </div>
                <div className="logoutBtn-container">
                    <Button variant={"primary"} onClick={handleLogout} className="logout-btn">Log out</Button>
                </div>
            </div>
            
            <div>
                {!isInRoom && (
                    <div className="lobby"> 
                    <button onClick={createRoom} className="create-room">Create Room</button>
                    {roomId && 
                        <div className="room-id">
                            <p>Room ID: {roomId}</p>
                            {isCopied === false ? (<i class="fa-regular fa-copy copy" onClick={CopyToClipboard}></i>) : (<i class="fa-solid fa-check"></i>)}
                        </div>
                    }
                    <input
                        type="text"
                        value={roomId}
                        className={"form-input"}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                    />
                    <button onClick={joinRoom} className="join-room">Join Room</button>
                    {error && <p>{error}</p>}
                    </div>
                )}
                {/* <Routes>
                    <Route path={`/game/${roomId}`} element={<GameRoom PlayerColor={PlayerColor} roomId={roomId} />} />
                </Routes> */}
            </div>
      </>
    );
};

export default Home;