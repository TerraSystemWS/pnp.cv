import React from "react";
import { FileHeader } from "./FileHeader";
import { Progress } from "flowbite-react";
import { FileError } from "react-dropzone";

export interface UploadErrorProps {
  file: File;
  onDelete: (file: File) => void;
  errors: FileError[];
}

export function UploadError({ file, onDelete, errors }: UploadErrorProps) {
  return (
    <React.Fragment>
      <FileHeader file={file} onDelete={onDelete} />
      <Progress progress={100} color="red" />
      {errors.map((error, index) => (
        <span className="text-red-500" key={index}>
          {error.message} : code {error.code}
        </span>
      ))}
    </React.Fragment>
  );
}
