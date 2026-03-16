export interface IPreambleRow {
  title: string;
  particulars: string;
  status: string;
}

export interface IPreamble {
  heading: string;
  paragraph: string;
  subtitle: string;
  tableRows: IPreambleRow[];
  createdAt?: Date;
  updatedAt?: Date;
}
