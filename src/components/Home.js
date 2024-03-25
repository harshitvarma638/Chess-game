import {React, useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";
import io from "socket.io-client";

const socket = io("http://localhost:3001", {transports: ['websocket']});

const Home = ()=>{
    const {logOut,user} = useUserAuth();
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [counter, setCounter] = useState(0);
    const [isInRoom, setIsInRoom] = useState(false);
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

    const incrementCounter = () => {
        socket.emit('incrementCounter', { roomId });
    }


    useEffect(() => {
        socket.on('room-created', ({ roomID }) => {
            setRoomId(roomID);
        });

        socket.on('room-joined', ({ roomID,counter }) => {
            setRoomId(roomID);
            setCounter(counter);
            setIsInRoom(true);
        });

        socket.on('room-full', ({ message }) => {
            setError(message);
        });

        socket.on('room-not-found', ({ message }) => {
            setError(message);
        });

        socket.on('counterUpdated', ({ counter }) => {
            setCounter(counter);
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
    }, []);

    return (
      <>
            <div className={"p-4 box mt-3 text-center"}>
                    Welcome <br/> {user && user.displayName ? user.displayName : user.email}
            </div>
            <div className={"d-grid gap-2"}>
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
                    <p>Room ID: {roomId}</p>
                    <p>Counter: {counter}</p>
                    <button onClick={incrementCounter}>Increment Counter</button>
                    </div>
                )}
            </div>
      </>
    );
};

export default Home;