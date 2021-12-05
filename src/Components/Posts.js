import React, { useEffect, useState } from 'react'
import { database } from '../firebase';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutline';
import Videos from './Videos';
import Like from './Like';
import Like2 from './Like2';
import AddComment from './AddComment';
import Comment from './Comment'
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import '../Styles/Posts.css'
import { Typography } from '@mui/material';


function Posts({ userData }) {

    const [posts, setPosts] = useState(null);
    const [open, setOpen] = useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };

    useEffect(() => {
        let parr = [];
        const unsub = database.posts.orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                let data = { ...doc.data(), postId: doc.id };
                parr.push(data);
            })
            setPosts(parr);
        })

        return unsub;
    }, [posts])

    const callback = (entries) => {
        entries.forEach((entry)=>{
            let ele = entry.target.childNodes[0]
            ele.play().then(()=>{
                if(!ele.paused && !entry.isIntersecting){
                    ele.pause()
                }
            })
        })
    }

    let observer = new IntersectionObserver(callback, { threshold: 0.6 });

    useEffect(() => {
        const elements = document.querySelectorAll('.videos');
        elements.forEach(element => {
            observer.observe(element)
        })

        return () => {
            observer.disconnect();
        }
    }, [posts])

    return (
        <div>
            {
                posts == null || userData == null ? <CircularProgress /> :
                    <div className="video-container">
                        {
                            posts.map((post, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className="videos">

                                            <Videos src={post.pUrl} id={post.pId} />
                                            <div className="fa" style={{ display: "flex" }}>
                                                <Avatar src={post.uProfile} />
                                                <h4>{post.uName}</h4>
                                            </div>
                                            <Like userData={userData} postData={post} />
                                            <ChatBubbleIcon className="chat-styling" onClick={() => handleClickOpen(post.pId)} />
                                            <Dialog
                                                open={open === post.pId}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                                fullWidth={true}
                                                maxWidth='md'
                                            >
                                                <div className="modal-container">
                                                    <div className="video-modal">
                                                        <video autoPlay={true} muted="muted" controls>
                                                            <source src={post.pUrl} />
                                                        </video>
                                                    </div>
                                                    <div className="comment-modal">
                                                        <Card className="card1" style={{ padding: '1rem' }}>
                                                            <Comment postData={post} />
                                                        </Card>
                                                        <Card className="card2" variant="outlined">
                                                            <Typography style={{ padding: '0.4rem' }}>{post.likes.length === 0 ? '' : `Liked by ${post.likes.length} users`}</Typography>
                                                            <div style={{ display: 'flex', marginBottom: "1%" }}>
                                                                <Like2 postData={post} userData={userData} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                                                <AddComment style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} userData={userData} postData={post} />
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default Posts
