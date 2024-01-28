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
        delete ret.__v;
      },
    },
  },
);

export default mongoose.model("order", OrderSchema);
