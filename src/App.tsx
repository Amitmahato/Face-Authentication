import React, { createContext, useState } from "react";
import "./App.css";
import Login from "./container/Login";
import Home from "./container/Home";

interface User {
  id: string;
  name: string;
}

interface AuthenticatedUser {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

// @ts-ignore
export const AuthenticationContext = createContext<AuthenticatedUser>(null);

const AuthenticationProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [user, setUser] = useState<User>({ id: "", name: "" });
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  return (
    <AuthenticationContext.Provider
      value={{
        user,
        setUser,
        loggedIn,
        setLoggedIn,
      }}
    >
      {loggedIn ? props.children : <Login />}
    </AuthenticationContext.Provider>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthenticationProvider>
          <Home />
        </AuthenticationProvider>
      </header>
    </div>
  );
}

export default App;
