import { useEffect } from "react";

export interface SingleFileUploadProgress {
  file: File[];
}

export function SingleFileUploadProgress({ file }: SingleFileUploadProgress) {
  useEffect(() => {
    function upload() {
      // const url = await upload(file);
    }

    upload();
  }, []);
  return <div>SFU</div>;
}

export function uploadFile(
  file: File,
  onProgress: (percentagem: number) => void
) {
  const url = "....";
  const key = "key";

  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = () => {
      res("url - quando o file for guardado");
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percetagem = (event.loaded / event.total) * 100;
        onProgress(Math.round(percetagem));
      }
    };
    const formData = new FormData();
    xhr.send(formData);
  });
}
