import { IUser } from "@/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: [{ type: Schema.Types.ObjectId, ref: "address", required: true }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "product", required: true }],
    orders: [{ type: Schema.Types.ObjectId, ref: "order", required: true }],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
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
