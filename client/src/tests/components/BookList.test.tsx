import { it, expect, describe } from 'vitest'
import BookList from '../../components/book-list/BookList';
import { render, screen } from "@testing-library/react";
import { WithProviders } from '../../utils/WithProviders';
import { Book } from '../../types/Book';
const mockData: Book[] = [
    {
      _id: "1",
      title: "BookTitle1",
      author: "Author 1",
      description: "",
      published: "",
      language: "English",
      genres: [],
      photos: [],
      reviews: [],
      grade: [],
      thumbnail: '',
      pages: 0,
    },
    {
      _id: "2",
      title: "BookTitle2",
      author: "Author 2",
      description: "",
      thumbnail: '',
      published: "",
      language: "English",
      genres: [],
      photos: [],
      reviews: [],
      grade: [],
      pages: 0,
    },
  ];
describe('Book List', () => {
    it('should render the BookList component', () => {
        const { getByText } = render(WithProviders(<BookList books={mockData} />));
  
        expect(getByText('BookTitle1')).toBeInTheDocument();
        expect(getByText('Author 1')).toBeInTheDocument();
        expect(getByText('BookTitle2')).toBeInTheDocument();
        expect(getByText('Author 2')).toBeInTheDocument();

        screen.debug()
    })
})