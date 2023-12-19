import { Theme } from "@emotion/react";
import { User } from "./User"
import { Book } from "./Book";

export type AuthContextType = {
    currentUser: User;
    setCurrentUser: (user: User) => void;
    message: string;
    setMessage: (input: string) => void;
    error: string;
    setError: (input: string) => void;
    loading: boolean;
    setLoading: (input: boolean) => void;
    currentTheme: Partial<Theme>;
    logout: () => void;
    login: (input: unknown) => void;
    toggle_theme: () => void;
    book: Book;
    setBook: (book: Book) => void;
    openMessage: boolean;
    openError: boolean;
    openBackdrop: boolean;
    setOpenMessage: (input: boolean) => void;
    setOpenError: (input: boolean) => void;
    setOpenBackdrop: (input: boolean) => void;
    clearMessage: () => void;
    clearError: () => void;
    handleCloseMessage: () => void;
    handleCloseError: () => void;
    handleCloseBackdrop: () => void;  
}