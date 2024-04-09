import {useState} from "react";
import {Form,Alert, Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";

const Signup = () => {
    const [email,setEmail] = useState("");
    const [name,setName] = useState(""); 
    const [error,setError] = useState("");
    const [password,setPassword] = useState("");
    const {signUp} = useUserAuth();
    let navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        try {
            await signUp(email,name,password);
            navigate("/");
        }
        catch(err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Register</h2>
                {error && <Alert variant={"damage"}>{error}</Alert> }
                <Form onSubmit={handleSubmit} className="login-form">
                    <Form.Group controlId={"formBasicEmail"}>
                        <Form.Control
                            type={"email"}
                            placeholder={"Email address"}
                            className={"form-input"}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId={"formBasicName"}>
                        <Form.Control
                            type={"input"}
                            placeholder={"Name"}
                            className={"form-input"}
                            onChange={(e)=> setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId={"formBasicPassword"}>
                        <Form.Control
                            type={"password"}
                            placeholder={"Password"}
                            className={"form-input"}
                            onChange={(e)=> setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className="loginbtn-container">
                        <Button variant={"primary"} type={"Submit"} className="login-btn">
                            Sign up
                        </Button>
                    </div>
                </Form>
                <div>
                    Already have a account?<Link to={"/"}>Log In</Link>
                </div>
            </div>
            
        </div>

    );
}

export default Signup;