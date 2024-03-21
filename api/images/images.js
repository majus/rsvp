import { GridFilesCollection } from 'meteor/majus:files-gridfs';

export const Image = new GridFilesCollection({
  collectionName: 'images',
  allowClientCode: true,
});
