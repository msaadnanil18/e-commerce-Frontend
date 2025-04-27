'use client';

import React from 'react';
import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineVideoCamera,
  AiOutlineFileWord,
  AiOutlineFileText,
} from 'react-icons/ai';

interface AttachmentViewerProps {
  file: File | string;
  style?: React.CSSProperties;
  className?: string;
  fileType?: string;
  onClick?: () => void;
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  file,
  style,
  fileType: _fileType,
  className,
  onClick,
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
    switch (fileType) {
      case 'image':
        return (
          <img
            src={fileUrl}
            alt='Attachment'
            className={className}
            //className='max-w-full max-h-96 object-contain'
            style={style}
            onClick={onClick}
          />
        );
      case 'video':
        return (
          <video controls onClick={onClick} className={className} style={style}>
            <source src={fileUrl} />
            Your browser does not support the video tag.
          </video>
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
          <iframe
            onClick={onClick}
            src={fileUrl}
            className={className}
            style={style}
          />
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
