import { IOrder } from "@/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true },
    customerId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    txnId: { type: String, required: true },
    items: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String },
          desc: { type: String },
          banner: { type: String },
          type: { type: String },
          unit: { type: Number },
          price: { type: Number },
          available: { type: Boolean },
          suplier: { type: String },
        },
        unit: { type: Number, required: true },
      },
    ],
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

export default mongoose.model("order", OrderSchema);
