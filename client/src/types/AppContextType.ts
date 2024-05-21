import { Theme } from "@emotion/react";

export type AppContextType = {
   token: string;
   setToken: (input: string) => void;
   currentTheme: Partial<Theme>;
   toggleTheme: () => void;
   openBackdrop: boolean;
   setOpenBackdrop: (input: boolean) => void;
   handleCloseBackdrop: () => void; 
   error: string;
   setError: (input: string) =>void; 
   openErrorAlert: boolean;
   setOpenErrorAlert: (input: boolean) => void;
   handleCloseErrorAlert: () => void;
   clearErrorMessage: () => void;
   success: string;
   setSuccess: (input: string) =>void; 
   openSuccessAlert: boolean;
   setOpenSuccessAlert: (input: boolean) => void;
   handleCloseSuccessAlert: () => void; 
   clearSuccessMessage: () => void;
}