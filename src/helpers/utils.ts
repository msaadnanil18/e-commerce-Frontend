import mongoose from 'mongoose';

export const generateUniqueId = (): string => {
  return new mongoose.Types.ObjectId().toHexString();
};

export const getRealFiles = (files: any[]): File[] => {
  return files.filter((file) => file instanceof File);
};

export const getPreviousMediaFiles = (file: File[]) => {
  return file.filter((file) => !(file instanceof File));
};
