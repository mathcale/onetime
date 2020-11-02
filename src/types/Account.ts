export interface Account {
  _id: string;
  userId: string;
  account: string;
  secret: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
}
