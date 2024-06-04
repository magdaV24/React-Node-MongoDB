import { render, screen, waitFor } from '@testing-library/react'
import { it, expect, describe, afterEach, beforeEach, vi } from 'vitest'
import BookPage from '../../pages/BookPage'
import { WithProviders } from '../../utils/WithProviders'
import useQueryHook from '../../hooks/useQueryHook'
import { mockBook, mockUser } from '../mockVariables'
import userEvent from '@testing-library/user-event'

describe('Book Page', () => {
  const user = userEvent.setup();

    beforeEach(()=> {
        vi.resetModules()
        vi.resetAllMocks();
      })
      afterEach(() => {
        vi.resetAllMocks();
      });
      
     // Mocking the useQueryHook
  const { mockedUseQueryHook } = vi.hoisted(() => ({
    mockedUseQueryHook: vi.fn(),
  }));

  vi.mock("../../hooks/useQueryHook.ts", () => ({
    default: mockedUseQueryHook,
  }));

    // Mocking the hook that fetches the current user
    const { mockedUseGetUser } = vi.hoisted(() => {
        return { mockedUseGetUser: vi.fn() };
      });
    
      vi.mock("../../hooks/useGetUser", () => ({
        default: mockedUseGetUser,
      }));

    it('should render the Book Page', () => {
        vi.mocked(useQueryHook).mockReturnValue({
            data: mockBook
          })
        render(WithProviders(<BookPage id={null} />))
        expect(screen.getByText(mockBook.title)).toBeInTheDocument();
        expect(screen.getByText(mockBook.author)).toBeInTheDocument();
        expect(screen.getByText(mockBook.description)).toBeInTheDocument();
        expect(screen.getByText(mockBook.language)).toBeInTheDocument();
        expect(screen.getByText(mockBook.published)).toBeInTheDocument();
        expect(screen.getByTitle('Genres List')).toBeInTheDocument();

        // The id is null, so no user is logged in; testing if the button that opens the review form and the reading status
        // input are not on the page

        expect(screen.queryByTitle("Add Review Button")).not.toBeInTheDocument();
        expect(screen.queryByTitle("Reading Status")).not.toBeInTheDocument();
        screen.debug()
    })

    it('the button responsible for showing the reviews should change its text when clicked', async () => {
        vi.mocked(useQueryHook).mockReturnValue({
            data: mockBook
          })
        render(WithProviders(<BookPage id={null} />))

        // const reviewsButton = screen.getByTitle("Show Reviews");
        // screen.debug()
        // await user.click(reviewsButton);

        // expect(screen.getByText("Hide Reviews")).toBeInTheDocument();
        // expect(screen.getByText(reviewsButton.innerHTML)).toBe("Hide Reviews")
        screen.debug();
    })

    it('should show the Add Review Button and Reading Status Form when the a user is logged in', async () => {
        mockedUseGetUser.mockReturnValue(mockUser)
        vi.mocked(useQueryHook).mockReturnValue({
            data: mockBook
          })
        render(WithProviders(<BookPage id={mockUser.id} />))
      
        expect(screen.queryByTitle("Add Review Button")).toBeInTheDocument();
        expect(screen.queryByTitle("Reading Status")).toBeInTheDocument();

        const addReviewButton = screen.getByTitle("Add Review Button");
        await user.click(addReviewButton);
        await waitFor(()=>{
            expect(screen.getByTitle("Review Form")).toBeInTheDocument();
        })
        screen.debug()
    })
    
})