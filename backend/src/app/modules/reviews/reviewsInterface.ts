export interface IReview {
  rating?: number;
  tag: string;
  title: string;
  text: string;
  author: string;
  guides: string[];
  status?: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITourReviewDocument {
  mainTitle: string;
  mainSubtitle: string;
  reviews: IReview[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
