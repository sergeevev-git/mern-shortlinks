import React from "react";
import "materialize-css";
import { useRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { authContext } from "./context/authContext";
import { NavBar } from "./components/navbar";
import { Loader } from "./components/loader";

function App() {
    const { token, login, logout, userId, ready } = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);

    if (!ready) {
        return <Loader />;
    }
    return (
        <authContext.Provider
            value={{ token, login, logout, userId, isAuthenticated }}
        >
            <BrowserRouter>
                {isAuthenticated && <NavBar />}
                <div className="container">{routes}</div>
            </BrowserRouter>
        </authContext.Provider>
    );
}

export default App;
