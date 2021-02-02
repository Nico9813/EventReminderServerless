import { useAuth0 } from "@auth0/auth0-react";
import '../App.css';

export const NavBar = ({ children }) => {

    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    return(
        <div className="App">
            <div className="NavBar">
                <p>EVENT REMINDER</p>
                {isAuthenticated ?
                    <button onClick={() => logout()}>Log Out</button>
                    :
                    <button onClick={() => loginWithRedirect()}>Log In</button>
                }
            </div>
            {children}
        </div>
    )
}

export default NavBar;