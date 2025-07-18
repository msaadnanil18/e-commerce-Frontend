import { startCase, toLower } from 'lodash-es';
import mongoose from 'mongoose';

export const EcommarceName = () => {
  const result = startCase(toLower(process.env.NEXT_PUBLIC_ECOMMERCE_NAME));
  return result;
};

export const generateUniqueId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};

export const getRealFiles = (files: any[]): File[] => {
  return files.filter((file) => file instanceof File);
};

export const getPreviousMediaFiles = (file: File[]) => {
  return file.filter((file) => !(file instanceof File));
};

export const updateMetadata = (title?: string, description?: string) => {
  if (typeof document === 'undefined') return;

  if (title) {
    document.title = `${title} | Acme`; // mimic the template behavior
  }

  if (description) {
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'description');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', description);
  }
};
