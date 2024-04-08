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
      <>
          <div>
              <h2>Login</h2>
              {error && <Alert variant={"damage"}>{error}</Alert> }
              <Form onSubmit={handleSubmit}>
                  <Form.Group className={"mb-3"} controlId={"formBasicEmail"}>
                      <Form.Control
                          type={"email"}
                          placeholder={"Email address"}
                          onChange={(e)=> setEmail(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group controlId={"formBasicPassword"}>
                      <Form.Control
                          type={"password"}
                          placeholder={"Password"}
                          onChange={(e)=> setPassword(e.target.value)}
                      />
                  </Form.Group>

                  <div>
                      <Button variant={"primary"} type={"Submit"}>
                          Log in
                      </Button>
                  </div>
              </Form>
              <hr/>
              <div>
                  <GoogleButton
                    className={"g-btn"}
                    type={"dark"}
                    onClick = {handleGoogleSignIn}
                  />
              </div>
          </div>
          <div>
              Dont have a account?<Link to={"/signup"}>Sign up</Link>
          </div>
      </>
    );
};

export default Login;