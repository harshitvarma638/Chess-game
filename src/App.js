import './App.css';
import {React,useState,useEffect} from "react";

// import {UserAuthContextProvider} from "./context/UserAuthConfig";
// import {Container,Row,Col} from "react-bootstrap";
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
import Board from "./components/Board";
import { gameSubject,initGame, resetGame } from './components/Game';


function App() {
    const [board, setBoard] = useState([]);
    const [isGameOver, setIsGameOver] = useState();
    const [result, setResult] = useState();
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

  return (
    //   <Router>
    //       <Container style={{ width: '400px' }}>
    //           <Row>
    //               <Col>
    //                   <UserAuthContextProvider>
    //                       <Routes>
    //                           <Route
    //                               path="/home"
    //                               element={
    //                                   <ProtectedRoute>
    //                                       <Home />
    //                                   </ProtectedRoute>
    //                               }
    //                           />
    //                           <Route path="/" element={<Login />} />
    //                           <Route path="/signup" element={<Signup />} />
    //                       </Routes>
    //                   </UserAuthContextProvider>
    //               </Col>
    //           </Row>
    //       </Container>
    //   </Router>
    <div className="container">
        {isGameOver && (
            <h2 className="vert-text"> GAME OVER 
                <button onClick={()=>resetGame()} className="new-game"><span>NEW GAME</span></button>
            </h2>
        )}
        {!isGameOver && <button onClick={()=>resetGame()} className="new-game margin"><span>NEW GAME</span></button>}
        <div className="board-container">
            <Board board = {board}/>
        </div>
        {result && <p className="result-text">{result}</p>}
    </div>
  );
}

export default App;
