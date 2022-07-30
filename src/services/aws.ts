import Rekognition from "aws-sdk/clients/rekognition";

const rekognition = new Rekognition({
  credentials: {
    accessKeyId: String(process.env.REACT_APP_AWS_ACCESS_KEY), // your aws iam user acces key id
    secretAccessKey: String(process.env.REACT_APP_AWS_SECRET_KEY), // your aws iam user secret key id
  },
  region: "us-east-1",
});

export { rekognition };
