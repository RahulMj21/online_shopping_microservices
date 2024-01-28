import { StatusCode } from "@/constants/app.constants";
import { ProductRepository } from "@/database";
import { ICreateProductInput, IProduct } from "@/types";
import { formateData } from "@/utils";
import { ApiError } from "@/utils/appError";

class ProductService {
  repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  async createProduct(input: ICreateProductInput) {
    try {
      const product = await this.repository.createProduct(input);
      return formateData(product);
    } catch (error) {
      throw new ApiError(
        "Failed to create product",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getProducts() {
    try {
      const products = await this.repository.products();
      let categories: Record<string, string> = {};

      products.forEach(({ type }: IProduct) => {
        categories[type] = type;
      });

      return formateData({
        products,
        categories: Object.keys(categories),
      });
    } catch (error) {
      throw new ApiError(
        "Failed to get products",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getProductDetails(productId: string) {
    try {
      const product = await this.repository.findById(productId);
      return formateData(product);
    } catch (error) {
      throw new ApiError(
        "Failed to get product",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getProductsByCategory(category: string) {
    try {
      const products = await this.repository.findByCategory(category);
      return formateData(products);
    } catch (error) {
      throw new ApiError(
        "Failed to get products",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getProductsByIds(ids: string[]) {
    try {
      const products = await this.repository.findSelectedProducts(ids);
      return formateData(products);
    } catch (error) {
      throw new ApiError(
        "Failed to get products",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}

export default ProductService;
