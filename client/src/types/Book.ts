import { Review } from "./Review"

export type Book = {
    id: string,
    author: string,
    title: string,
    description: string,
    language: string,
    genres: string[],
    photos: string[],
    reviews: Review[],
    pages: number,
    grade: number[],
    published: string
}