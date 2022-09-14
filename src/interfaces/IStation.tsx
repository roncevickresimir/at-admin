export interface ILocation {
  lat: number;
  lng: number;
}
export default interface IStation {
  id: string;
  name: string;
  description: string;
  categories: string[];
  published: boolean;
  premium: boolean;
  images: any;
  user: string;
  location: ILocation;
}
