import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../../App";
import CameraFeed from "../../component/camera-feed";
import {
  COLLECTION_NAME,
  FACE_MATCH_THRESHOLD,
} from "../../interfaces/rekognition";
import { rekognition } from "../../services/aws";

const styles = {
  button: {
    width: "100px",
    height: "40px",
    fontSize: "20px",
  },
  error: {
    padding: 15,
    color: "red",
    fontSize: 18,
    fontStyle: "italic",
  },
};

const Login: React.FC = () => {
  const { loggedIn, setLoggedIn, setUser } = useContext(AuthenticationContext);
  const [image, setImage] = useState<Blob | null>(null);
  const [error, setError] = useState<any>(null);

  const createCollection = async () => {
    try {
      rekognition.createCollection(
        {
          CollectionId: COLLECTION_NAME,
        },
        (_, data) => {
          if (data) {
            console.log("Collection created: ", data);
          }
        }
      );
    } catch (e) {
      console.log("Error Creating Collection: ", e);
      setError(e);
    }
  };

  const validateUserName = (userName: string): Boolean => {
    const regex = /[a-zA-Z0-9_.\-:]+/;
    return regex.test(userName);
  };

  const handleRegister = async () => {
    if (image) {
      let userName: any = "";

      while (!validateUserName(userName)) {
        userName = prompt("Enter your name: ");
        userName = userName?.split(" ").join("-").toLowerCase();
        console.log(userName);
      }

      if (userName && userName.length > 0) {
        const imageBuffer = await image.arrayBuffer();
        await createCollection();
        rekognition.indexFaces(
          {
            CollectionId: "face-recognition",
            Image: {
              Bytes: imageBuffer,
            },
            ExternalImageId: userName,
            MaxFaces: 1,
          },
          (err, data) => {
            if (err) {
              console.log("Error indexing face: ", err);
              setError(err);
            } else {
              console.log("Indexed Face Data: ", data);
              const face = data?.FaceRecords?.[0]?.Face;
              if (face) {
                setUser({
                  id: String(face?.FaceId),
                  name: String(face?.ExternalImageId)
                    .split("-")
                    .join(" ")
                    .toUpperCase(),
                });
                setLoggedIn(true);
              } else {
                setError(
                  "There are no faces in the image. Should be at least 1."
                );
              }
            }
          }
        );
      } else {
        setError("Plese set an username to register.");
      }
    } else {
      setError("Capture an image first");
    }
  };

  const handleLogin = async () => {
    if (image) {
      const imageBuffer = await image.arrayBuffer();
      rekognition.searchFacesByImage(
        {
          CollectionId: "face-recognition",
          Image: {
            Bytes: imageBuffer,
          },
          MaxFaces: 1,
          FaceMatchThreshold: 98,
        },
        (err, data) => {
          if (err) {
            console.log("Error searching a face match: ", err);
            setError(err);
          } else {
            console.log("Face Found: ", data);
            data.FaceMatches?.forEach((face) => {
              if (Number(face.Similarity) > FACE_MATCH_THRESHOLD) {
                setUser({
                  id: String(face.Face?.FaceId),
                  name: String(face.Face?.ExternalImageId)
                    .split("-")
                    .join(" ")
                    .toUpperCase(),
                });
                setLoggedIn(true);
              }
            });
          }
        }
      );
    } else {
      console.log("error");
      setError("Capture an image first");
    }
  };

  const handleDeleteCollection = async () => {
    try {
      rekognition.deleteCollection(
        {
          CollectionId: COLLECTION_NAME,
        },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            console.log("Collection Deleted Successfully: ", data);
          }
        }
      );
    } catch (err) {
      console.log("Error Deleting Collection: ", err);
      setError("Error Deleting Collection " + JSON.stringify(err));
    }
  };

  useEffect(() => {
    if (image) {
      setError(null);
    }
  }, [image]);

  return (
    <div>
      {loggedIn ? (
        <button
          onClick={() => {
            setLoggedIn(false);
          }}
          style={styles.button}
        >
          Log Out
        </button>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "680px",
              height: "580px",
            }}
          >
            <CameraFeed sendFile={setImage as BlobCallback} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <button onClick={() => handleLogin()} style={styles.button}>
              Login
            </button>
            <button onClick={() => handleRegister()} style={styles.button}>
              Register
            </button>
            <button
              onClick={() => handleDeleteCollection()}
              style={{ ...styles.button, width: "200px" }}
            >
              Clean User Data
            </button>
          </div>
          {error && <div style={styles.error}>{JSON.stringify(error)}</div>}
        </div>
      )}
    </div>
  );
};

export default Login;
