import { useState } from "react";
import debounce from "lodash.debounce";
import useMutationHook from "./useMutationHook"; // Adjust the import based on your actual file structure
import { StreamingProfileTypes } from "@cloudinary/url-gen/types/types";

export default function useSearchBooks(url: string, queryToInvalidate?: string) {
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const { postData, loading } = useMutationHook(url, queryToInvalidate);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  const handleOpenSearchResult = () => {
    setOpenSearchResult(true);
  };

  const handleCloseSearchResult = () => {
    setOpenSearchResult(false);
  };

  const debouncedSearchFunction = debounce(
    async (input: StreamingProfileTypes) => {
      if (input === '') {
        setSearchResult([]);
        handleCloseSearchResult();
        return;
      }
      const searchTerm = { input };
      const res = await postData(searchTerm);
      setSearchResult(res);
      handleOpenSearchResult();
    },
    600
  );

  return {
    searchInput,
    setSearchInput,
    searchResult,
    loading,
    searchFunction: debouncedSearchFunction,
    openSearchResult,
    setOpenSearchResult,
    handleCloseSearchResult,
  };
}
