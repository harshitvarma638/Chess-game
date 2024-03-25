// import {useState} from "react";
import {Navigate} from "react-router-dom";
import {useUserAuth} from "../context/UserAuthConfig";

const ProtectedRoute = ({children}) => {
    const { user } = useUserAuth();

    console.log("check user in private:", user);
    if(!user){
        return <Navigate to={"/"}/>;
    }
    return children;
};

export default ProtectedRoute;