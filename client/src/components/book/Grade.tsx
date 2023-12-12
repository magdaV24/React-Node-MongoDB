import { Rating, Typography } from "@mui/material";
import { useMemo } from "react";

interface Props{
    grade: []
}

export default function Grade({grade}: Props){

    const calculate_grade = (input: []) => {
      if (input.length === 0) {
        return 0;
      }

      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        sum = sum + input[i];
      }
      return sum / grade.length;
    }

    const averageGrade = useMemo(() => calculate_grade(grade), [grade]);

    return (
      <>
        <Rating name="disabled" value={averageGrade} disabled />
        <Typography sx={{ mt: 0.25 }}>{averageGrade.toFixed(2)}</Typography>
      </>
    );
}