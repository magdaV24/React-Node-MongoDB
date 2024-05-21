import { Box } from "@mui/material";
import { Comment } from "../types/Comment";
import CommentCard from "./CommentCard";
import '../styles/components/commentsListWrapper.css'
interface Props{
    data: Comment[];
    userId: string | undefined
}
export default function CommentsList({data, userId}: Props) {
 return(
    <Box className="comments-list-wrapper">
        {data.map((comment: Comment)=> (
            <CommentCard comment={comment} userId={userId}/>
        ))}
    </Box>
 )   
}
