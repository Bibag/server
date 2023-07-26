import mongoose from 'mongoose';
import { Password } from '../services/password';
import { getFirstLetter, removeSpace, toNonAccentVietnamese } from '../ultils/search';

// An interface that describes the properties
// that are requried to create a new City
interface CityAttrs {
  code: string;
  name: string;
}

// An interface that describes the properties
// that a City Model has
interface CityModel extends mongoose.Model<CityDoc> {
  build(attrs: CityAttrs): CityDoc;
}

// An interface that describes the properties
// that a City Document has
interface CityDoc extends mongoose.Document {
  code: string;
  name: string;
  search: string;
}

const citySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
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

citySchema.pre('save', async function (done) {
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

citySchema.statics.build = (attrs: CityAttrs) => {
  return new City(attrs);
};

const City = mongoose.model<CityDoc, CityModel>('City', citySchema);

export { City };

getFirstLetter('Hello World');
