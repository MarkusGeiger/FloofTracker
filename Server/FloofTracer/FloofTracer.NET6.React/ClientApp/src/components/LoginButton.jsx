import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "antd";
import { Loading } from "./Loading";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    //redirectUri: window.location.origin + "/app", 
    return <Button type="primary" onClick={() => loginWithRedirect({ onRedirecting: () => <Loading /> })}>Log In</Button>;
};

export default LoginButton;