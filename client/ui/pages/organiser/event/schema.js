import SimpleSchema from 'simpl-schema';

export const eventSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  'organiserId': {
    type: String,
    label: 'Organiser',
  },
  startsAt: {
    type: Date,
    label: 'Starts At',
  },
  description: {
    type: String,
    label: 'Description',
  },
  imageId: {
    type: String,
    label: 'ImageId',
  },
  depositAmount: {
    type: Number,
    label: 'Deposit',
    min: 0.01,
  },
});
