import React from 'react';
import { Button } from "flowbite-react";

export interface FileHeaderProps {
  file: File;
  onDelete: (file: File) => void;
}

export function FileHeader({ file, onDelete }: FileHeaderProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      <div className='col-start-1 col-end-3'>{file.name}</div>
      <div className='col-end-7 col-span-2'>
        <Button size="xs" onClick={() => onDelete(file)}>
          Delete
        </Button> 
      </div>
    </div>
  );
}