import { useContext, useState } from "react";
import { AuthenticationContext } from "../../App";
import Login from "../Login";
import logo from "../../logo.svg";
import { rekognition } from "../../services/aws";
import { COLLECTION_NAME } from "../../interfaces/rekognition";

const Home = () => {
  const { user } = useContext(AuthenticationContext);
  const [users, setUsers] = useState<string[]>([]);

  const handleShowFaces = () => {
    rekognition.listFaces(
      {
        CollectionId: COLLECTION_NAME,
      },
      (err, data) => {
        if (data) {
          const externalUsers =
            data.Faces?.map((face) =>
              String(face.ExternalImageId).split("-").join(" ").toUpperCase()
            ) ?? [];
          setUsers(externalUsers);
        }
      }
    );
  };

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
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleShowFaces}>Show All Users Registered</button>
        <ol style={{ textAlign: "start" }}>
          {users.map((user) => (
            <li>{user}</li>
          ))}
        </ol>
      </div>
    </>
  );
};
export default Home;
