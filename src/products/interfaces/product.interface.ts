export interface IProduct {
  productId: string;
  title: string;
  description: string;
  price: number;
  publishDate: string;
  photoLink: string;
}

export interface IPaginatedProducts {
  products: IProduct[];
  nextKey?: string | null;
}
