import { it, expect, describe, vi, afterEach, beforeAll } from 'vitest'
import usePostData from '../../hooks/usePostData';
import { renderHook, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';

describe('usePostData', () => {

    const spyAxios = vi.spyOn(axios, 'post');
    beforeAll(()=>{
        const mockResponse = Promise.resolve({
            data: {
                result: { message: 'Success!' }
            }
        });
        spyAxios.mockReturnValue(mockResponse)
    })

    afterEach(()=>{
        vi.resetAllMocks();
    })
    const mockURL = 'mockURL';
    const mockInput = {
        input: 'inputValue'
    }

    it('should return a success message when successful', async () =>  {
        const { result } = renderHook(()=>usePostData());
        const postData = result.current;
        const response = await postData(mockURL, mockInput);

        await waitFor(() => {
            expect(response?.data.result).toEqual({ message: 'Success!' });
        });
    });
    
    it('should handle errors correctly', async () => {
        const mockError = {
            response: {
                data: 'Error occurred!',
            },
        } as AxiosError;

        spyAxios.mockRejectedValue(mockError);

        const { result } = renderHook(() => usePostData());
        const postData = result.current;

        const consoleSpy = vi.spyOn(console, 'log');

        const response = await postData(mockURL, mockInput);

        await waitFor(() => {
            expect(response).toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith('Error occurred!');
        });

        consoleSpy.mockRestore();
    });
})