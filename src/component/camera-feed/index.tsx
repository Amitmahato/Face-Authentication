import { useCallback, useEffect, useRef, useState } from "react";

interface ICameraFeed {
  sendFile: BlobCallback;
}

enum CameraFeedElements {
  VIDEO_PLAYER = "videoPlayer",
  CANVAS = "canvas",
}

type CameraFeedElementTypes =
  | CameraFeedElements.CANVAS
  | CameraFeedElements.VIDEO_PLAYER;

const CameraFeed: React.FC<ICameraFeed> = (props) => {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [hideElement, setHideElement] = useState<CameraFeedElementTypes>(
    CameraFeedElements.CANVAS
  );
  const [localStream, setLocalStream] = useState<MediaStream>();

  const startCamera = useCallback(() => {
    (async () => {
      console.log("Starting Camera");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      });
      if (videoPlayer.current && stream) {
        videoPlayer.current.srcObject = stream;
        videoPlayer.current.play();
        setLocalStream(stream);
      }
    })();
  }, []);

  const stopCamera = useCallback(() => {
    if (localStream && videoPlayer.current) {
      console.log("Stopping Camera");
      videoPlayer.current.pause();
      localStream?.getTracks().forEach((track) => track.stop());
    }
  }, []);

  useEffect(() => {
    if (hideElement === CameraFeedElements.VIDEO_PLAYER) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [hideElement, startCamera, stopCamera]);

  /**
   * Handles taking a still image from the video feed on the camera
   */
  const takePhoto = () => {
    const { sendFile } = props;
    if (canvas.current && videoPlayer.current) {
      const context = canvas.current.getContext("2d");
      context?.drawImage(videoPlayer.current, 0, 0, 680, 510);
      canvas.current.toBlob(sendFile);
    }
    setHideElement(CameraFeedElements.VIDEO_PLAYER);
  };

  return (
    <div>
      <div>
        <video
          ref={videoPlayer}
          width="680px"
          height="510px"
          style={{
            transform: "rotateY(180deg)", // flip camera feed horizontally & display
            display:
              hideElement === CameraFeedElements.VIDEO_PLAYER
                ? "none"
                : "block",
          }}
        />
      </div>
      <div>
        <canvas
          width="680"
          height="510"
          ref={canvas}
          style={{
            transform: "rotateY(180deg)", // flip captured image horizontally & display
            display:
              hideElement === CameraFeedElements.CANVAS ? "none" : "block",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {hideElement === CameraFeedElements.CANVAS ? (
          <button
            onClick={() => takePhoto()}
            style={{ padding: 5, margin: 10 }}
          >
            Take photo!
          </button>
        ) : (
          <button
            onClick={() => setHideElement(CameraFeedElements.CANVAS)}
            style={{ padding: 5, margin: 10 }}
          >
            Re-take photo!
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
