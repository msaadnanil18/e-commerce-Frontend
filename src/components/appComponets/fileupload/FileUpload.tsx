'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  Ref,
} from 'react';
import { FiUpload, FiPlus } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import { Controller, UseControllerProps, UseFormReturn } from 'react-hook-form';
import RenderFileList from './RenderFileList';

interface FileUploadProps {
  id?: string;
  onFileChange?: (files: File[]) => void;
  maxFiles?: number;
  accept?: string | string[];
  maxSize?: number;
  enableDragDrop?: boolean;
  multiple?: boolean;
  variant?: 'default' | 'compact' | 'card' | 'icon' | 'button';
  uploadIcon?: React.ReactNode;
  uploadButtonText?: string;
  showFileList?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fileListClassName?: string;
  name?: string;
  extraFormFields?: UseControllerProps;
  form?: UseFormReturn<any>;
  fileUploadRef?: Ref<{ resetFile: () => void }>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  maxFiles = 5,
  fileListClassName,
  id = 'fileUploadInput',
  accept = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.svg',
    '.webp',
    '.mp4',
    '.mov',
    '.avi',
    '.mkv',
    '.mp3',
    '.wav',
    '.ogg',
    '.zip',
    '.rar',
    '.7z',
    '.csv',
    '.html',
    '.css',
    '.js',
    '.json',
    '.xml',
    '.psd',
    '.ai',
    '.sketch',
  ].join(','),
  maxSize = 10,
  enableDragDrop = true,
  multiple = true,
  variant = 'default',
  uploadIcon = <FiUpload className='w-6 h-6' />,
  uploadButtonText = 'Upload Files',
  showFileList = true,
  className,
  style,
  name,
  form,
  extraFormFields,
  fileUploadRef,
}) => {
  const [files, setFiles] = useState<File[]>(() => {
    const watchedFiles = name ? form?.watch(name) : undefined;
    if (!watchedFiles) return [];
    return Array.isArray(watchedFiles) ? watchedFiles : [watchedFiles];
  });
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles)
      .filter((file) => file.size <= maxSize * 1024 * 1024)
      .slice(0, maxFiles);

    const updatedFiles = multiple
      ? [...files, ...validFiles].slice(0, maxFiles)
      : validFiles.slice(0, 1);

    setFiles(updatedFiles);
    onFileChange?.(updatedFiles);

    return multiple ? updatedFiles : updatedFiles[0] || null;
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFileChange?.(updatedFiles);
    if (form && name)
      form.setValue(name, !updatedFiles.length ? null : updatedFiles);
    if (selectedFile === fileToRemove) {
      setSelectedFile(null);
    }
  };

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    if (form?.formState.isSubmitSuccessful) {
      setFiles([]);
    }
  }, [form?.formState.isSubmitSuccessful]);

  const resetFile = () => {
    setFiles([]);
  };

  useImperativeHandle(fileUploadRef, () => ({ resetFile }), [resetFile]);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!enableDragDrop) return;

    switch (e.type) {
      case 'dragenter':
      case 'dragover':
        setDragOver(true);
        break;
      case 'dragleave':
        setDragOver(false);
        break;
      case 'drop':
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
        break;
    }
  };

  const renderFileList = () =>
    showFileList &&
    files.length > 0 && (
      <RenderFileList
        {...{ files, handleFileClick, fileListClassName, removeFile }}
      />
    );

  const renderUploadArea = () => {
    switch (variant) {
      case 'icon':
        return (
          <div
            onClick={() => fileInputRef.current?.click()}
            className='cursor-pointer'
          >
            {uploadIcon}
          </div>
        );
      case 'button':
        return (
          <button
            onClick={() => fileInputRef.current?.click()}
            className='flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
          >
            {uploadIcon}
            <span>{uploadButtonText}</span>
          </button>
        );
      case 'compact':
        return (
          <div
            onClick={() => fileInputRef.current?.click()}
            className='w-full p-3 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-sm'
          >
            <FiPlus className='w-6 h-6 text-gray-500 mb-2' />
            <p className='text-center text-gray-600'>Click to upload files</p>
          </div>
        );
      case 'card':
        return (
          <div
            onClick={() => fileInputRef.current?.click()}
            className='w-full p-4 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center shadow-lg bg-white'
          >
            <FiUpload className='w-12 h-12 text-gray-500 mb-4' />
            <p className='text-center text-gray-600 mb-2'>
              Drag and drop files or click to upload
            </p>
            <p className='text-xs text-gray-500'>
              Max {maxFiles} files, {maxSize}MB each
            </p>
          </div>
        );
      default:
        return (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEvents}
            onDragLeave={handleDragEvents}
            onDragOver={handleDragEvents}
            onDrop={handleDragEvents}
            className={`
                  w-full p-6 border-2 border-dashed rounded-lg transition-all duration-300
                  ${
                    dragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }
                  cursor-pointer flex flex-col items-center justify-center
                `}
          >
            <FiUpload className='w-12 h-12 text-gray-500 mb-4' />
            <p className='text-center text-gray-600 mb-2'>
              {enableDragDrop
                ? 'Drag and drop files or click to upload'
                : 'Click to upload files'}
            </p>
            <p className='text-xs text-gray-500'>
              Max {maxFiles} files, {maxSize}MB each
            </p>
          </div>
        );
    }
  };
  const acceptString = Array.isArray(accept) ? accept.join(',') : accept;

  if (form && name) {
    return (
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <div style={style} className={twMerge(className)}>
            {renderUploadArea()}
            <input
              id={id}
              type='file'
              ref={fileInputRef}
              onChange={(e) => {
                const selectedFiles = e.target.files;
                const updatedFiles = handleFileSelect(selectedFiles);
                field.onChange(updatedFiles);
              }}
              multiple={multiple}
              accept={acceptString}
              className='hidden'
            />
            {renderFileList()}
            {form.formState.errors && form.formState.errors[name] && (
              <p className='text-red-500 text-sm mt-1'>
                {typeof form.formState.errors?.[name]?.message === 'string' &&
                  form.formState.errors[name].message}
              </p>
            )}
          </div>
        )}
        {...extraFormFields}
      />
    );
  }

  return (
    <div style={style} className={twMerge(className)}>
      {renderUploadArea()}
      <input
        type='file'
        id={id}
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files)}
        multiple={multiple}
        accept={acceptString}
        className='hidden'
      />
      {renderFileList()}
    </div>
  );
};

export default FileUpload;
