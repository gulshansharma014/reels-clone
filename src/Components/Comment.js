import React, {useState, useEffect} from 'react'
import { database } from '../firebase'
import { Avatar } from '@mui/material'
import { CircularProgress } from '@mui/material'

function Comment({postData}) {
    const [comments,setComments] = useState(null)
    useEffect(()=>{
        fetchComments();
    },[postData])

    const fetchComments = async() => {
        let arr = []
        for(let i=0;i<postData.comments.length;i++){
            let data = await database.comments.doc(postData.comments[i]).get()
            arr.push(data.data())
        }
        setComments(arr)
    }
    return (
        <div>
            {
                comments==null? <CircularProgress/> :
                <>
                {
                    comments.map((comment,index)=>(
                        <div style={{display:'flex'}}>
                            <Avatar  src={comment.uProfileImage}/>
                            <p>&nbsp;&nbsp;<span style={{fontWeight:'bold'}}>{comment.uName}</span>&nbsp;&nbsp; {comment.text}</p>
                        </div>
                    ))
                }
                </>
            }
        </div>
    )
}

export default Comment
