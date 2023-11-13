import { Timestamp } from "firebase/firestore";

export interface Producto{
  id: string,
  titulo: string,
  url?: string,
  estado: string,
  image: string,
  comentarios: Comentario[],
  date: Timestamp
}

export interface  Comentario{
  name: string,
}
