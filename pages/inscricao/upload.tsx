import { useS3Upload } from "next-s3-upload";
import { useState } from "react";

export default function UploadPage() {
  let { uploadToS3, files } = useS3Upload();
  let [link, setLink] = useState("");

  let handleFileChange = async (event: any) => {
    // alert("terrq");
    let file = event.target.files[0];
    let { url } = await uploadToS3(file);
    setLink(url);
  };

  return (
    <div>
      <input onChange={handleFileChange} type="file" />

      <div className="pt-8">
        {files.map((file, index) => (
          <div key={index}>
            Ficheiro #{index} progress: {Math.round(file.progress)}% ::{" "}
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              link do documento
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
