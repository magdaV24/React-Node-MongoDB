// React testing library imports
import { render } from "@testing-library/react";

// Vitest imports
import { it, expect, describe } from 'vitest'

// The tested component
import BookList from '../../components/book-list/BookList';

// Utils 
import { WithProviders } from '../../utils/WithProviders';
import { mockBooksData } from '../mockVariables';// a mocked list of books for testing

describe('Book List', () => {
    it('should render the BookList component', () => {
        const { getByText } = render(WithProviders(<BookList books={mockBooksData} />));
  
        expect(getByText('BookTitle1')).toBeInTheDocument();
        expect(getByText('Author 1')).toBeInTheDocument();
        expect(getByText('BookTitle2')).toBeInTheDocument();
        expect(getByText('Author 2')).toBeInTheDocument();
    })
})