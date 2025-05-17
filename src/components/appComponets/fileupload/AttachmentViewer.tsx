'use client';

import React, { useState } from 'react';
import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineVideoCamera,
  AiOutlineFileWord,
  AiOutlineFileText,
} from 'react-icons/ai';
import { Spinner } from 'tamagui';

interface AttachmentViewerProps {
  file: File | string;
  style?: React.CSSProperties;
  className?: string;
  fileType?: string;
  onClick?: () => void;
  MediaHTMLAttributes?:
    | React.VideoHTMLAttributes<HTMLVideoElement>
    | React.AudioHTMLAttributes<HTMLAudioElement>;
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  file,
  style,
  fileType: _fileType,
  className,
  onClick,
  MediaHTMLAttributes,
}) => {
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv'];
    const audioExtensions = ['mp3'];
    const documentExtensions = ['pdf', 'doc', 'docx'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (documentExtensions.includes(extension)) return 'document';
    return 'unknown';
  };

  const renderIcon = (type: string) => {
    const iconClasses = 'w-12 h-12 text-gray-500';

    switch (type) {
      case 'image':
        return <AiOutlineFileImage className={iconClasses} />;
      case 'video':
        return <AiOutlineVideoCamera className={iconClasses} />;
      case 'audio':
        return <AiOutlineFileText className={iconClasses} />; // Using FileText as a fallback
      case 'document':
        return <AiOutlineFileWord className={iconClasses} />;
      case 'pdf':
        return <AiOutlineFilePdf className={iconClasses} />;
      default:
        return <AiOutlineFileText className={iconClasses} />; // Generic file icon
    }
  };

  const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
  const fileType = getFileType(typeof file === 'string' ? file : file.name);

  const renderContent = () => {
    const [loading, setLoading] = useState(true);
    switch (fileType) {
      case 'image':
        return (
          <>
            {loading && <Spinner />}
            <img
              src={fileUrl}
              alt='Attachment'
              className={className}
              //className='max-w-full max-h-96 object-contain'
              style={style}
              onClick={onClick}
              onLoad={() => setLoading(false)}
            />
          </>
        );
      case 'video':
        return (
          <>
            {loading && <Spinner />}
            <video
              {...MediaHTMLAttributes}
              src={fileUrl}
              controls={MediaHTMLAttributes?.controls ?? true}
              onClick={onClick}
              className={className}
              style={style}
              onCanPlay={() => setLoading(false)}
            />
          </>
        );
      case 'audio':
        return (
          <audio onClick={onClick} controls className={className} style={style}>
            <source src={fileUrl} />
            Your browser does not support the audio tag.
          </audio>
        );
      case 'document':
        return (
          <>
            {loading && <Spinner />}
            <iframe
              onClick={onClick}
              src={fileUrl}
              className={className}
              onLoad={() => setLoading(false)}
              style={style}
            />
          </>
        );
      default:
        return (
          <div
            className={`flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 ${className}`}
            style={style}
          >
            {renderIcon(fileType)}
            <p className='mt-2 text-gray-500'>Unsupported File Type</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default AttachmentViewer;
