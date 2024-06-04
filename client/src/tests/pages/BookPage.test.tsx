import { render } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import BookPage from '../../pages/BookPage'
import { WithProviders } from '../../utils/WithProviders'

describe('Book Page', () => {
    it('should render the Book Page', () => {
        render(WithProviders(<BookPage id={null} />))
    })
    
})