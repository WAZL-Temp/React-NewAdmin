import { Product } from "../model/product";
import { BaseService } from "../../sharedBase/baseService";

export const productService = new BaseService<Product>("ProductLive");
