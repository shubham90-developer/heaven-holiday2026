export interface IManagementCard {
  name: string;
  image: string;
  status: string;
}

export interface IManagement {
  heading: string;
  paragraph: string;
  cards: IManagementCard[];
  createdAt?: Date;
  updatedAt?: Date;
}
