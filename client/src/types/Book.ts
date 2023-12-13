import { Review } from "./Review"

export type Book = {
    _id: string,
    author: string,
    title: string,
    description: string,
    language: string,
    genres: [],
    photos: [],
    reviews: Review[],
    pages: number,
    grade: [],
    published: string
}