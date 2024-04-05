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
import { gameSubject,initGame } from './components/Game';


function App() {
    const [board, setBoard] = useState([]);
    useEffect(() => {
        initGame()
        const subscribe = gameSubject.subscribe((game) => {
            setBoard(game.board);
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
        <div className="board-container">
            <Board board = {board}/>
        </div>
    </div>
  );
}

export default App;
