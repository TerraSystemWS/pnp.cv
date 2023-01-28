// export { APIRoute as default } from "next-s3-upload";

import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  bucket: "pnp-fileserver-0000",
  region: "us-east-1",
});
