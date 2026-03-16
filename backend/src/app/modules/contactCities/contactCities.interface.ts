export interface ICity extends Document {
  name: string;
  icon: string; // store icon name or identifier
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}
