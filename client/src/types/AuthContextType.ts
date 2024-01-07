import { Theme } from "@emotion/react";
import { User } from "./User"
import { Book } from "./Book";
import { Token } from "./Token";

export type AuthContextType = {
    currentUser: User;
    setCurrentUser: (user: User) => void;
    token: Token;
    setToken: (input: Token) => void
    message: string;
    setMessage: (input: string) => void;
    error: string;
    setError: (input: string) => void;
    disabled: boolean;
    setDisabled: (input: boolean) => void;
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