import React, { FC, useState } from 'react';
import { FiFileText, FiTrash2 } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import Modal from '../modal/PopupModal';
import AttachmentViewer from './AttachmentViewer';
import { MdCancel } from 'react-icons/md';
import { useScreen } from '@/hook/useScreen';

const RenderFileList: FC<{
  fileListClassName?: string;
  style?: React.CSSProperties;
  handleFileClick?: (file: File) => void;
  removeFile?: (file: File) => void;
  files: File[];
  renderFileOnClick?: FC;
}> = ({
  fileListClassName,
  files,
  removeFile,
  handleFileClick,
  style,
  renderFileOnClick: RenderFileOnClick,
}) => {
  const screen = useScreen();
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  let uri = null;

  if ((selectedFile as any)?.key) {
    uri = `${process.env.NEXT_PUBLIC_API_URL}/file/${
      (selectedFile as any)?.key
    }`;
  }

  return (
    <div style={style} className='mt-4 space-y-2'>
      <Modal
        height={500}
        width={screen.xs ? 400 : 900}
        open={approveDialogOpen}
        cancelTextButtonProps={{ size: '$3', icon: <MdCancel /> }}
        onClose={setApproveDialogOpen}
        children={
          selectedFile && (
            <AttachmentViewer
              file={uri || selectedFile}
              style={{ width: '100%', height: '100%' }}
            />
          )
        }
      />

      {(files || [])?.map((file: File, index: number) => (
        <div
          key={index}
          className={twMerge(
            'flex items-center justify-between p-2 bg-gray-100 ',
            fileListClassName
          )}
        >
          <div
            className='flex items-center space-x-3 cursor-pointer'
            onClick={() => {
              setApproveDialogOpen(true);
              setSelectedFile(file);
              if (handleFileClick) handleFileClick(file);
            }}
          >
            <FiFileText className='w-6 h-6 text-blue-500' />
            <div>
              <p className='text-sm font-medium truncate max-w-[200px]'>
                {file.name || (file as any)?.filename}
              </p>
              <p className='text-xs text-gray-500'>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {removeFile && (
            <button
              onClick={() => removeFile(file)}
              className='text-red-500 hover:text-red-700'
            >
              <FiTrash2 className='w-5 h-5' />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RenderFileList;
