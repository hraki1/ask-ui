export default interface UpsertPost {
  id?: string;
  title: string;
  question: string;
  creator?: string;
  imageUrl?: string;
  image?: File | undefined;
  answers?: [];
}
