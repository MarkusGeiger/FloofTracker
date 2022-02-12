import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";

const AuthWrapper = ({children}) => {
    const { isAuthenticated } = useAuth0();
    return(
        <>
            {isAuthenticated ? children : <LoginButton />}
        </>
    );
}

export default AuthWrapper;