import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    customerId: { type: String, required: true },
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
      transform(_doc, ret) {
        delete ret.__vk;
      },
    },
  },
);

export default mongoose.model("cart", CartSchema);
