export interface IContent {
  title: string;
  subtitle: string;
  description: string;
  button?: {
    text: string;
    link: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
