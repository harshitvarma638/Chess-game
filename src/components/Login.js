import {useState} from "react";
import {Form,Alert,Button} from "react-bootstrap";
import {Link,useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";
import GoogleButton from "react-google-button";


const Login = ()=>{
    const [email,setEmail] = useState("");
    const [error,setError] = useState("");
    const [password,setPassword] = useState("");
    const {logIn,googleSignIn} = useUserAuth();
    let navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        try{
            await logIn(email,password);
            navigate("/home");
        }
        catch(err){
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async(e) => {
        e.preventDefault();
        try {
            await googleSignIn();
            navigate("/home");
        }
        catch(error){
            console.log(error.message);
        }
    };

    return (
      <div className="login-page">
          <div className="login-container">
              <h2>Login</h2>
              {error && <Alert variant={"damage"}>{error}</Alert> }
              <Form onSubmit={handleSubmit} className="login-form">
                  <Form.Group controlId={"formBasicEmail"}>
                      <Form.Control
                          type={"email"}
                          placeholder={"Email address"}
                          className="form-input"
                          onChange={(e)=> setEmail(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group controlId={"formBasicPassword"} >
                      <Form.Control
                          type={"password"}
                          placeholder={"Password"}
                          className="form-input"
                          onChange={(e)=> setPassword(e.target.value)}
                      />
                  </Form.Group>

                  <div className="loginbtn-container">
                      <Button variant={"primary"} type={"Submit"} className="login-btn">
                          Log in
                      </Button>
                  </div>
              </Form>
              <hr/>
              <div className="google">
                  <GoogleButton
                    className={"g-btn"}
                    type={"dark"}
                    onClick = {handleGoogleSignIn}
                  />
              </div>
              <div>
                Dont have a account?<Link to={"/signup"}>Sign up</Link>
              </div>
          </div>
          
      </div>
    );
};

export default Login;