import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { database } from '../firebase'
import Navbar from './Navbar'
import { CircularProgress } from '@mui/material'
import { Avatar } from '@mui/material'
import Comment from './Comment'
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card'
import Like2 from './Like2'
import AddComment from './AddComment'
import { Typography } from '@mui/material'
import GridOnIcon from '@mui/icons-material/GridOn';
import '../Styles/Profile.css'

function Profile() {
    const { id } = useParams()
    const [userData, setUserdata] = useState(null)
    const [posts, setPosts] = useState(null);
    const [open, setOpen] = useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };

    useEffect(() => {
        database.users.doc(id).onSnapshot(snapshot => {
            setUserdata(snapshot.data());
        })
    }, [id])

    useEffect(async () => {
        if (userData != null) {
            let parr = [];
            for (let i = 0; i < userData?.postIds?.length; i++) {
                let postData = await database.posts.doc(userData.postIds[i]).get()
                parr.push({ ...postData.data(), postId: postData.id })
            }
            setPosts(parr)
        }
    }, [userData])
    return (
        <div>
            <Navbar userData={userData} />
            <div className="spacer"></div>
            {
                posts == null || userData == null ? <CircularProgress /> :
                    <div className="profileWrapper">

                        <div className="profileHeader" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "44px", flexBasis: "50%" }}>
                            <Avatar
                                alt={userData.fullname}
                                src={userData.profileUrl}
                                sx={{ width: 150, height: 150 }}
                            />
                            <div className="info">
                                <h1>{userData.fullname}</h1>
                                <div className="info-2">
                                    <span> <strong>Email: </strong>{userData.email}</span>
                                    {
                                        userData.postIds.length == null ?
                                            <span><strong>{0}</strong> Posts</span> :
                                            <span><strong>{userData.postIds.length}</strong> Posts</span>

                                    }
                                </div>
                            </div>


                        </div>
                        <div className="icon">
                            <GridOnIcon />
                        </div>
                        {
                            posts == null ?
                                <></> :
                                <div className="profile-videos">

                                    {

                                        posts.map((post, index) => (
                                            <React.Fragment key={index}>
                                                <div className="videos">
                                                    <video muted="muted" onClick={() => handleClickOpen(post.pId)}>
                                                        <source src={post.pUrl} />
                                                    </video>
                                                    <Dialog
                                                        open={open == post.pId}
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
                                                                <Card variant="outlined" className="card2">
                                                                    <Typography style={{ padding: '0.4rem' }}>{post.likes == null ? 'Liked by nobody' : `Liked by ${post.likes.length} users`}</Typography>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <Like2 postData={post} userData={userData} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                                                        <AddComment style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} userData={userData} postData={post} />
                                                                    </div>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Dialog>
                                                </div>
                                            </React.Fragment>
                                        ))

                                    }

                                </div>
                        }


                    </div>
            }
        </div>
    )
}

export default Profile
