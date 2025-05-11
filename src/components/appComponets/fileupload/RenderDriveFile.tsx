'use client';
import React, { useState } from 'react';
import AttachmentViewer from './AttachmentViewer';
import { Spinner } from 'tamagui';
import RenderFileList from './RenderFileList';

interface fileProps {
  filename?: string;
  filetype?: string;
  size?: number;
  key?: string;
}

const RenderDriveFile = ({
  style,
  file,
  inline = false,
  className,
  onClick,
  MediaHTMLAttributes,
}: {
  file: fileProps;
  style?: React.CSSProperties;
  inline?: boolean;
  className?: string;
  onClick?: () => void;
  MediaHTMLAttributes?:
    | React.VideoHTMLAttributes<HTMLVideoElement>
    | React.AudioHTMLAttributes<HTMLAudioElement>;
}) => {
  if (!file?.key) return <Spinner />;
  const [selectedFile, setSelectedFile] = useState<fileProps | null>(null);
  const uri = `${process.env.NEXT_PUBLIC_API_URL}/file/${file?.key}`;

  if (inline) {
    // const _uri = `${process.env.NEXT_PUBLIC_API_URL}/file/${selectedFile?.key}`;
    return (
      <div>
        <RenderFileList
          handleFileClick={(file) => {
            setSelectedFile(file);
          }}
          files={[
            {
              name: file.filename || '',
              size: file.size || 0,
              // @ts-ignore
              key: file.key as string,
            },
          ]}
        />
      </div>
    );
  }

  return (
    <AttachmentViewer
      MediaHTMLAttributes={MediaHTMLAttributes}
      className={className}
      style={style}
      file={uri}
      onClick={onClick}
      fileType={file?.filetype}
    />
  );
};

export default RenderDriveFile;
