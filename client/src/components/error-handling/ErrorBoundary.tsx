import { Box, Button, Typography } from "@mui/material";
import { FallbackProps } from "react-error-boundary";

export const ErrorBoundary: React.FC<FallbackProps> = ({
    error,
    resetErrorBoundary,
  }) =>{
 return(
    <Box>
        <Typography>Something went wrong!</Typography>
        <Typography>{error.message}</Typography>
        <Button onClick={resetErrorBoundary}></Button>
    </Box>
 )   
}
