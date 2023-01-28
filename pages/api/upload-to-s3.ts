import fs from "fs";
import AWS from "aws-sdk";
import formidable, { Fields } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

const s3Client = new AWS.S3({
  endpoint: process.env.DO_SPACES_URL,
  region: process.env.REGION,
  credentials: {
    accessKeyId: "AKIAT2JZFRQCRYBIMSF3",
    secretAccessKey: "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",
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable();

  form.parse.apply(req, async (err: any, fields, files) => {
    if (!files.demo) {
      res.status(400).send("nenhum ficheiro submetido");
    }

    try {
      return s3Client.putObject(
        {
          Bucket: "pnp-fileserver-0000",
          Key: files.demo.originalFilename,
          Body: fs.createReadStream(files.demo.filepath),
        },
        async () => {
          // res.status(201).send("file uploaded")
          if (err) console.log(err);
          else res.status(201).send("File uploaded");
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Error uploading file");
    }
  });
}
