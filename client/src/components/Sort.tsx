import { Box, Button, Paper } from "@mui/material";
import { useEffect, useReducer } from "react";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import '../styles/components/reviewList.css'

interface State {
  showAll: boolean;
  showFinished: boolean;
  showDNF: boolean;
  showStars: string | null;
}

type Action =
  | { type: "SHOW_ALL" }
  | { type: "SHOW_FINISHED" }
  | { type: "SHOW_DNF" }
  | { type: "SHOW_STARS"; payload: string }
  | { type: "UNCHECK" };
interface SortProps {
  onSortChange: (finished: string, stars: string) => void;
  setFinished: (finished: string) => void;
  setStars: (stars: string) => void;
}

export default function Sort({ onSortChange, setFinished, setStars }: SortProps) {
  const sortingReducer = (state: State, action: Action) => {
    switch (action.type) {
      case "SHOW_ALL":
        return { ...state, showAll: true, showFinished: false, showDNF: false, showStars: null };
      case "SHOW_FINISHED":
        return { ...state, showAll: false, showFinished: true, showDNF: false, showStars: null };
      case "SHOW_DNF":
        return { ...state, showAll: false, showFinished: false, showDNF: true, showStars: null };
      case "SHOW_STARS":
        return { ...state, showAll: false, showFinished: false, showDNF: false, showStars: action.payload };
      case "UNCHECK":
        return { ...state, showAll: true, showFinished: false, showDNF: false, showStars: null };
      default:
        return state;
    }
  };

  const initialState: State = {
    showAll: true,
    showFinished: false,
    showDNF: false,
    showStars: null,
  };
  const [state, dispatch] = useReducer(sortingReducer, initialState);

  useEffect(() => {
    onSortChange(state.showFinished ? "Finished" : state.showDNF ? "DNF" : "", state.showStars || "");
  }, [onSortChange, state.showAll, state.showDNF, state.showFinished, state.showStars]);

  const handleButtonClick = (type: "SHOW_ALL" | "SHOW_FINISHED" | "SHOW_DNF" | "SHOW_STARS" | "UNCHECK", payload: string | null = null) => {
    if (type === "SHOW_ALL") {
      dispatch({ type: "SHOW_ALL" });
      setFinished("");
      setStars("");
    } else if (type === "SHOW_FINISHED") {
      if (state.showFinished) {
        dispatch({ type: "UNCHECK" });
        setFinished("");
      } else {
        dispatch({ type: "SHOW_FINISHED" });
        setFinished("Finished"); 
      }
      setStars("");
    } else if (type === "SHOW_DNF") {
      if (state.showDNF) {
        dispatch({ type: "UNCHECK" });
        setFinished("");
      } else {
        dispatch({ type: "SHOW_DNF" });
        setFinished("DNF"); 
      }
      setStars(""); 
    } else if (type === "SHOW_STARS") {
      if (state.showStars === payload) {
        dispatch({ type: "UNCHECK" });
        setStars(""); 
      } else {
        dispatch({ type: "SHOW_STARS", payload: payload! });
        setStars(payload!); 
      }
      setFinished(""); // Reset finished filter
    } else if (type === "UNCHECK") {
      dispatch({ type: "UNCHECK" });
      setFinished("");
      setStars(""); 
    }
  };
  
  
  
  

  return (
    <Paper className="sort-form">
      <Box>
        <Button onClick={() => handleButtonClick("SHOW_ALL")}>
          {state.showAll ? <CheckCircleSharpIcon /> : <CheckCircleOutlineSharpIcon />} All
        </Button>
        <br />
        <Button onClick={() => handleButtonClick("SHOW_FINISHED")}>
          {state.showFinished ? <CheckBoxSharpIcon /> : <CheckBoxOutlineBlankSharpIcon />} Finished
        </Button>
        <Button onClick={() => handleButtonClick("SHOW_DNF")}>
          {state.showDNF ? <CheckBoxSharpIcon /> : <CheckBoxOutlineBlankSharpIcon />} Did Not Finish
        </Button>
      </Box>
      <br />
      <Box>
        {[1, 2, 3, 4, 5].map((stars) => (
          <Button key={stars} onClick={() => handleButtonClick("SHOW_STARS", stars.toString())}>
            {state.showStars === stars.toString() ? <CheckCircleSharpIcon /> : <CheckCircleOutlineSharpIcon />} {stars} Stars
          </Button>
        ))}
      </Box>
    </Paper>
  );
}