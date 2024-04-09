import './App.css';
import {React} from "react";
import {UserAuthContextProvider} from "./context/UserAuthConfig";
import {Container,Row,Col} from "react-bootstrap";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
    

  return (
      <Router>
          <Container>
              <Row>
                  <Col> 
                      <UserAuthContextProvider>
                          <Routes>
                              <Route
                                  path="/home"
                                  element={
                                      <ProtectedRoute>
                                          <Home />
                                      </ProtectedRoute>
                                  }
                              />
                              <Route path="/" element={<Login />} />
                              <Route path="/signup" element={<Signup />} />
                          </Routes>
                      </UserAuthContextProvider>
                   </Col>
              </Row>
          </Container>
      </Router>
  );
}

export default App;
