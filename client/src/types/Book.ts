import { Review } from "./Review";

export type Book = {
    _id: string,
    author: string,
    title: string,
    description: string,
    language: string,
    genres: string[],
    photos: string[],
    reviews: Review[],
    pages: number,
    thumbnail: string,
    grade: number[],
    published: string
} | null;