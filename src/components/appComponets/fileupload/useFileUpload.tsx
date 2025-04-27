'use client';

import { ServiceErrorManager } from '@/helpers/service';
import { generateUniqueId } from '@/helpers/utils';
import { GetSignedUrlService } from '@/services/fileUpload';
import axios from 'axios';
import { kebabCase } from 'lodash-es';

const useFileUpload = () => {
  const id = generateUniqueId();

  const getFileUpload = async (acceptedFiles: File[]) => {
    const [_, { signedUrls }] = await ServiceErrorManager(
      GetSignedUrlService({
        data: {
          files: acceptedFiles.map((file) => {
            const ext = file.name.split('.').pop();
            const filename = file.name.split('.').slice(0, -1).join('-');
            const uniqueKey = `${
              process.env.NEXT_PUBLIC_ECOMMERCE_NAME
            }-${kebabCase(filename)}-${id}.${ext}`;

            return {
              filename: file.name,
              filetype: file.type,
              size: file.size,
              key: uniqueKey,
            };
          }),
        },
      }),
      { failureMessage: 'Error while uploading files' }
    );

    await Promise.all(
      acceptedFiles.map((file, index) =>
        axios.put(signedUrls[index].signedUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
      )
    );

    return acceptedFiles.map((file, index) => {
      const ext = file.name.split('.').pop();
      const filename = file.name.split('.').slice(0, -1).join('-');
      const uniqueKey = `${process.env.NEXT_PUBLIC_ECOMMERCE_NAME}-${kebabCase(
        filename
      )}-${id}.${ext}`;

      return {
        filename: file.name,
        filetype: file.type,
        size: file.size,
        key: uniqueKey,
      };
    });
  };

  return { getFileUpload };
};

export default useFileUpload;
