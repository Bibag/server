import mongoose from 'mongoose';
import { Password } from '../services/password';
import { getFirstLetter, removeSpace, toNonAccentVietnamese } from '../ultils/search';

// An interface that describes the properties
// that are requried to create a new Ward
interface WardAttrs {
  code: string;
  name: string;
  district_code: string;
  don_vi: string;
  city_code: string;
}

// An interface that describes the properties
// that a Ward Model has
interface WardModel extends mongoose.Model<WardDoc> {
  build(attrs: WardAttrs): WardDoc;
}

// An interface that describes the properties
// that a Ward Document has
interface WardDoc extends mongoose.Document {
  code: string;
  name: string;
  district_code: string;
  don_vi: string;
  city_code: string;
  search: string;
}

const wardSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city_code: {
      type: String,
      required: true,
    },
    district_code: {
      type: String,
      required: true,
    },
    don_vi: {
      type: String,
      required: true,
    },
    search: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

wardSchema.pre('save', async function (done) {
  const noneVietnamese = toNonAccentVietnamese(this.get('name'));
  const noneVietnameseRemoveSpace = removeSpace(noneVietnamese);
  const firstLetters = getFirstLetter(noneVietnamese);
  const search = [
    this.get('name'),
    removeSpace(this.get('name')),
    firstLetters,
    noneVietnamese,
    noneVietnameseRemoveSpace,
  ].join(' ');
  this.set('search', search);

  done();
});

wardSchema.statics.build = (attrs: WardAttrs) => {
  return new Ward(attrs);
};

const Ward = mongoose.model<WardDoc, WardModel>('Ward', wardSchema);

export { Ward };
