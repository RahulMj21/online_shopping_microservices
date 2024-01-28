import { IUser } from "@/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: [{ type: Schema.Types.ObjectId, ref: "address", required: true }],
    wishlist: [
      {
        _id: { type: String, required: true },
        name: { type: String },
        banner: { type: String },
        price: { type: Number },
        description: { type: String },
        available: { type: Boolean },
      },
    ],
    orders: [
      {
        _id: { type: String, required: true },
        amount: { type: String },
        date: { type: Date, default: new Date().toISOString() },
      },
    ],
    cart: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
        },
        unit: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password, delete ret.__v;
      },
    },
  },
);

export default mongoose.model("customer", customerSchema);
