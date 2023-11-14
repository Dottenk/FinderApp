import { Timestamp } from "firebase/firestore";

export interface Producto{
  id: string,
  titulo: string,
  url?: string,
  estado: boolean,
  image: string,
  comentarios: Comentario[],
  date: Timestamp
}

export interface  Comentario{
  name: string,
}
