export interface Producto{
  id: string,
  titulo: string,
  url?: string,
  estado?: string,
  image: string,
  comentarios: Comentario[]
}

export interface  Comentario{
  name: string,
}
