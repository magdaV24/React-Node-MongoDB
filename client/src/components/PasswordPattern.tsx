// MUI imports
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import { Tooltip, IconButton } from '@mui/material';

export default function PasswordPattern() {
    const title = (
        <div style={{ fontSize: '12px' }}>
          <div>Password must contain at least one uppercase letter.</div>
          <div>Password must contain at least one number.</div>
          <div>Password must contain at least one special character (! . @ # $ % ^ & *).</div>
        </div>
      );
    return(
    <Tooltip title={title} leaveDelay={200} placement="right">
        <IconButton>
            <InfoSharpIcon />
        </IconButton>
      </Tooltip>
    )
}
