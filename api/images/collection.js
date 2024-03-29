import { GridFilesCollection } from 'meteor/majus:files-gridfs';

export const Images = new GridFilesCollection({
  collectionName: 'images',
  allowClientCode: true,
});
