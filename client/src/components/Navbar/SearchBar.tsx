import { InputBase, alpha, Box, styled, Menu, MenuItem } from "@mui/material";
import { Book } from "../../types/Book";
import SearchResult from "./SearchResult";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import "../../styles/components/navbar.css";

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '60vw',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

interface Props {
  searchInput: string;
  setSearchInput: (input: string) => void;
  openSearchResult: boolean;
  searchResult: Book[];
  searchFunction: (input: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloseSearchResult: () => void;
  setOpenSearchResult: (input: boolean) => void;
}

export default function SearchBar({
  handleCloseSearchResult,
  openSearchResult,
  searchResult,
  searchInput,
  searchFunction,
  setSearchInput,
}: Props) {
  function handleSearchInput(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setSearchInput(input);
    searchFunction(input, event);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Search>
        <SearchIconWrapper>
          <SearchSharpIcon />
        </SearchIconWrapper>
        <StyledInputBase
          type="text"
          placeholder="Search…"
          value={searchInput}
          onChange={handleSearchInput}
        />
      </Search>
      <Box sx={{ backgroundColor: 'background.paper' }}>
        {openSearchResult && (
          <Menu
            open={true}
            onClose={handleCloseSearchResult}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            className="search-result-wrapper"
          >
            {searchResult.map((res: Book) => (
              <MenuItem key={res!._id}>
                <SearchResult
                  title={res!.title}
                  author={res!.author}
                  photo={res!.photos}
                />
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>
    </Box>
  );
}
