import { boolean, string } from "yup";
import { ILocation } from "./IStation";

export default interface IQuest {
  id: string;
  name: string;
  description: string;
  categories: any[];
  userId: string;
  location: ILocation;
  stations: any;
  published: boolean;
  image: string;
}
