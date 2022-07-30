import { useContext } from "react";
import { AuthenticationContext } from "../../App";
import Login from "../Login";
import logo from "../../logo.svg";

const Home = () => {
  const { user } = useContext(AuthenticationContext);
  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <h3>Welcome back {user.name}!</h3>
      <span>
        Continue Learning{" "}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
      </span>
      <div style={{ marginTop: "20px" }}>
        <Login />
      </div>
    </>
  );
};
export default Home;
