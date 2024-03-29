import SimpleSchema from 'simpl-schema';

export const eventSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  startsAt: {
    type: Date,
    label: 'Date',
  },
  description: {
    type: String,
    label: 'Description',
  },
  imageId: {
    type: String,
    label: 'Image',
  },
  depositAmount: {
    type: Number,
    label: 'Deposit',
    min: 0.000001,
  },
});
