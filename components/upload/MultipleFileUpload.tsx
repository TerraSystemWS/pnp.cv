// import { Grid, makeStyles } from '@material-ui/core';
import { useField } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { FileError, FileRejection, useDropzone } from "react-dropzone";
import { SingleFileUpload } from "./SingleFileUpload";

export interface UploadableFile {
  file: File;
  errors: FileError[];
  url?: string;
}

// const useStyles = makeStyles((theme) => ({
//   dropzone: {
//     border: `2px dashed ${theme.palette.primary.main}`,
//     borderRadius: theme.shape.borderRadius,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: theme. palette.background.default,
//     height: theme.spacing(10),
//     outline: 'none',
//   },
// }));

export function MultipleFileUploadField({ name }: { name: string }) {
  const [_, __, helpers] = useField(name);

  const [files, setFiles] = useState<UploadableFile[]>([]);

  const onDrop = useCallback((accFiles: File[], rejFiles: FileRejection[]) => {
    const mappedAcc = accFiles.map((file) => ({ file, errors: [] }));
    setFiles((curr) => [...curr, ...mappedAcc, ...rejFiles]);
  }, []);

  useEffect(() => {
    helpers.setValue(files);
    //helpers.setTouched(true);
  }, [files]);

  function onUpload(file: File, url: string) {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url };
        }
        return fw;
      })
    );
  }

  function onDelete(file: File) {
    alert("teste apagar file....");
    setFiles((curr) => curr.filter((fw) => fw.file !== file));
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "audio/mpeg": [".mpeg"],
      "application/pdf": [".pdf"],
    },
  });

  return (
    <React.Fragment>
      <div
        {...getRootProps({ className: "dropzone flex text-sm text-gray-600" })}
      >
        {/* <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-medium text-amarelo-ouro focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-amarelo-escuro"
              > */}

        <input
          //   id="file-upload"
          // name="file-upload"
          // type="file"
          className="sr-only"
          {...getInputProps()}
        />
        <p>Drag & drop some files here, or click to select files</p>
        {/* <span>Upload dos Ficheiros</span> */}
        {/* </label> */}
      </div>

      <p className="text-xs text-gray-500">PNG, JPG, GIF, mp4, mp3</p>

      {/* {files.map((fileWrapper, index) => (
          <SingleFileUpload  
          key={index}          
          onDelete={onDelete}
          onUpload={onUpload}
          file={fileWrapper.file}
          />
        ))}  */}

      {files.map((fileWrapper, index) => (
        <div key={index}>
          {fileWrapper.errors.length ? (
            <div>ERROR</div>
          ) : (
            <SingleFileUpload
              onDelete={onDelete}
              onUpload={onUpload}
              file={fileWrapper.file}
            />
          )}
        </div>
      ))}

      {JSON.stringify(files)}
    </React.Fragment>
  );
}
