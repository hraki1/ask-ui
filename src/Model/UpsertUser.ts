export default interface UpsertUser {
  name?: string;
  id?: string;
  email?: string;
  password?: string;
  imageUrl?: string;
  bio?: string;
  image?: File | undefined;
}
