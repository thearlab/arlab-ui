import { useId, useState, type DragEvent } from 'react';
import { UploadIcon } from './icons';

export interface DropzoneProps {
  onFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  hint?: string;
}

export function Dropzone({ onFiles, accept, multiple = false, title = 'Drop a file here', hint }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const id = useId();

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  }

  return (
    <label
      htmlFor={id}
      className={['arlab-dropzone', dragging ? 'drag' : ''].filter(Boolean).join(' ')}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') (e.currentTarget.querySelector('input') as HTMLInputElement)?.click();
      }}
    >
      <span className="arlab-dropzone-target">
        <UploadIcon size={20} />
      </span>
      <span className="arlab-dropzone-title">{title}</span>
      {hint ? <span className="arlab-dropzone-hint">{hint}</span> : null}
      <span className="arlab-dropzone-browse">Browse files</span>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </label>
  );
}
