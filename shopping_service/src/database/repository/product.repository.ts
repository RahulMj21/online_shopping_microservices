import { StatusCode } from "@/constants/app.constants";
import { ApiError } from "@/utils/appError";
import { ProductModel } from "@/database/models";
import { ICreateProductInput } from "@/types";

class ProductRepository {
  async createProduct({
    name,
    type,
    unit,
    price,
    banner,
    suplier,
    available,
    description,
  }: ICreateProductInput) {
    try {
      const newProduct = await ProductModel.create({
        name,
        type,
        unit,
        price,
        banner,
        suplier,
        available,
        description,
      });
      return newProduct;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to create product",
      );
    }
  }

  async products() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find products",
      );
    }
  }

  async findById(id: string) {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find product",
      );
    }
  }

  async findByCategory(category: string) {
    try {
      const products = await ProductModel.find({ type: category });
      return products;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find products",
      );
    }
  }

  async findSelectedProducts(selectedIds: string[]) {
    try {
      const products = await ProductModel.find()
        .where("_id")
        .in(selectedIds)
        .exec();
      return products;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find products",
      );
    }
  }
}

export default ProductRepository;
