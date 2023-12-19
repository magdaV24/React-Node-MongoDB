import { Button, Paper } from "@mui/material";
import { useEffect, useReducer } from "react";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";

interface MenuProps {
  show_all: () => void;
  show_finished: (input: string) => void;
  show_stars: (input: string) => void;
}

type Action =
  | { type: "SHOW_ALL" }
  | { type: "SHOW_FINISHED" }
  | { type: "SHOW_DNF" }
  | { type: "UNCHECK" }
  | { type: "SHOW_ONE_STAR" }
  | { type: "SHOW_TWO_STARS" }
  | { type: "SHOW_THREE_STARS" }
  | { type: "SHOW_FOUR_STARS" }
  | { type: "SHOW_FIVE_STARS" };

interface State {
  showAll: boolean;
  showFinished: boolean;
  showDNF: boolean;
  showOneStar: boolean;
  showTwoStars: boolean;
  showThreeStars: boolean;
  showFourStars: boolean;
  showFiveStars: boolean;
}

export default function Sort({
  show_finished,
  show_all,
  show_stars,
}: MenuProps) {
  
  const sortingReducer = (state: State, action: Action) => {
    switch (action.type) {
      case "SHOW_ALL":
        return {
          ...state,
          showAll: true,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_FINISHED":
        return {
          ...state,
          showAll: false,
          showFinished: true,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_DNF":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: true,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_ONE_STAR":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: false,
          showOneStar: true,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_TWO_STARS":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: true,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_THREE_STARS":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: true,
          showFourStars: false,
          showFiveStars: false,
        };
      case "SHOW_FOUR_STARS":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: true,
          showFiveStars: false,
        };
      case "SHOW_FIVE_STARS":
        return {
          ...state,
          showAll: false,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: true,
        };
      case "UNCHECK":
        return {
          ...state,
          showAll: true,
          showFinished: false,
          showDNF: false,
          showOneStar: false,
          showTwoStars: false,
          showThreeStars: false,
          showFourStars: false,
          showFiveStars: false,
        };
      default:
        return state;
    }
  };

  const initialState: State = {
    showAll: true,
    showFinished: false,
    showDNF: false,
    showOneStar: false,
    showTwoStars: false,
    showThreeStars: false,
    showFourStars: false,
    showFiveStars: false,
  };
  const [state, dispatch] = useReducer(sortingReducer, initialState);

  useEffect(() => {
    show_all()
    if (state.showAll) {
      show_all();
    } else if (state.showFinished) {
      show_finished("Finished");
    } else if (state.showDNF) {
      show_finished("DNF");
    } else if (state.showOneStar) {
      show_stars("1");
    } else if (state.showTwoStars) {
      show_stars("2");
    } else if (state.showThreeStars) {
      show_stars("3");
    } else if (state.showFourStars) {
      show_stars("4");
    } else if (state.showFiveStars) {
      show_stars("5");
    }
  }, [
    state.showAll,
    state.showDNF,
    state.showFinished,
    state.showFiveStars,
    state.showFourStars,
    state.showOneStar,
    state.showThreeStars,
    state.showTwoStars,
  ]);

  return (
    <Paper
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: 'center',
        gap: 1,
        margin: 0,
        ml: -9,
        p: 1
      }}
    >
      {/* Shows all the reviews */}
      {state.showAll ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> All
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_ALL" })}>
          <CheckCircleOutlineSharpIcon /> All
        </Button>
      )}
      <br />
      {/* Shows the reviews that have "Finished" as the value of the field "finished" */}
      {state.showFinished ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckBoxSharpIcon /> Finished
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_FINISHED" })}>
          <CheckBoxOutlineBlankSharpIcon /> Finished
        </Button>
      )}
      {state.showDNF ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckBoxSharpIcon /> Did Not Finish
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_DNF" })}>
          <CheckBoxOutlineBlankSharpIcon /> Did Not Finish
        </Button>
      )} 
      <br />
      {state.showOneStar ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> One Star
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_ONE_STAR" })}>
          <CheckCircleOutlineSharpIcon /> One Star
        </Button>
      )}
      {state.showTwoStars ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> Two Stars
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_TWO_STARS" })}>
          <CheckCircleOutlineSharpIcon /> Two Stars
        </Button>
      )}
      {state.showThreeStars ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> Three Stars
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_THREE_STARS" })}>
          <CheckCircleOutlineSharpIcon /> Three Stars
        </Button>
      )}
      {state.showFourStars ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> Four Stars
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_FOUR_STARS" })}>
          <CheckCircleOutlineSharpIcon /> Four Stars
        </Button>
      )}
      {state.showFiveStars ? (
        <Button onClick={() => dispatch({ type: "UNCHECK" })}>
          <CheckCircleSharpIcon /> Five Stars
        </Button>
      ) : (
        <Button onClick={() => dispatch({ type: "SHOW_FIVE_STARS" })}>
          <CheckCircleOutlineSharpIcon /> Five Stars
        </Button>
      )}
    </Paper>
  );
}
