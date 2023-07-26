import mongoose from 'mongoose';
import { Password } from '../services/password';
import { getFirstLetter, removeSpace, toNonAccentVietnamese } from '../ultils/search';

// An interface that describes the properties
// that are requried to create a new District
interface DistrictAttrs {
  code: string;
  name: string;
  city_code: string;
  don_vi: string;
  full_name: string;
}

// An interface that describes the properties
// that a District Model has
interface DistrictModel extends mongoose.Model<DistrictDoc> {
  build(attrs: DistrictAttrs): DistrictDoc;
}

// An interface that describes the properties
// that a District Document has
interface DistrictDoc extends mongoose.Document {
  code: string;
  name: string;
  city_code: string;
  don_vi: string;
  full_name: string;
  search: string;
  city: {
    type: mongoose.ObjectId;
    ref: 'City';
  };
}

const districtSchema = new mongoose.Schema(
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
    don_vi: {
      type: String,
      required: true,
    },
    full_name: {
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

districtSchema.pre('save', async function (done) {
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

districtSchema.statics.build = (attrs: DistrictAttrs) => {
  return new District(attrs);
};

const District = mongoose.model<DistrictDoc, DistrictModel>('District', districtSchema);

export { District };
