import { Progress } from "flowbite-react";
import { useEffect, useState } from "react";
import { FileHeader } from "./FileHeader";
import AWS from "aws-sdk";

export interface SingleFileUpload {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File, url: string) => void;
}

export function SingleFileUpload({
  file,
  onDelete,
  onUpload,
}: SingleFileUpload) {
  const [progress, SetProgress] = useState(0);

  useEffect(() => {
    async function upload() {
      const url = await uploadFile(file, SetProgress);
      console.log("url", url);
      onUpload(file, url);
    }

    upload();
  }, []);

  return (
    <div>
      <FileHeader file={file} onDelete={onDelete} />
      <Progress progress={progress} color="blue" />
    </div>
  );
}

function uploadFile(file: File, onProgress: (percentage: number) => void) {
  const url: string = "/api/upload";
  const key: string = "chave";

  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url);
    xhr.onload = () => {
      res("where the file is saved");
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentage));
      }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);

    xhr.send(formData);
  });
}
