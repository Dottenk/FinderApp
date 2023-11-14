import { Timestamp } from "firebase/firestore";

export interface Product{
  id: string,
  category: string,
  url?: string,
  status: boolean,
  image: string,
  description: string,
  date: Timestamp,
  site: string
}



