import React from "react";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";

const Home = ()=>{
    const {logOut,user} = useUserAuth();
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

    return (
      <>
          <div className={"p-4 box mt-3 text-center"}>
                Welcome <br/> {user && user.displayName ? user.displayName : user.email}
          </div>
          <div className={"d-grid gap-2"}>
              <Button variant={"primary"} onClick={handleLogout}>Log out</Button>
          </div>
      </>
    );
};

export default Home;