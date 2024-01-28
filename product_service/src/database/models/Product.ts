import { IProduct } from "@/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    banner: { type: String, required: true },
    suplier: { type: String, required: true },
    description: { type: String, required: true },
    unit: { type: Number, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.__v;
      },
    },
  },
);

export default mongoose.model("product", ProductSchema);
