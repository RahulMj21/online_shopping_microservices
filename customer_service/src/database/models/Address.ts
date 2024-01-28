import { IAddress } from "@/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.__v;
      },
    },
  },
);

export default mongoose.model("address", AddressSchema);
