import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import UploadFIle from './UploadFIle';
import { database } from '../firebase';
import Navbar from './Navbar';
import Posts from './Posts';
import '../Styles/Feed.css'


function Feed() {

    const { user } = useContext(AuthContext);
    const[userData, setUserData] = useState('');
    useEffect(()=>{
        const unsub = database.users.doc(user.uid).onSnapshot(snapshot=>{
            setUserData(snapshot.data());
        })
        return ()=>{unsub()};
    },[user]);

    return (
        <>
            <Navbar userData={userData} />
            <div className="spacer"></div>
            <div className="feedWrapper">
                    <UploadFIle user={userData} />
                    <Posts userData={userData} />
            </div>
        </>
    )
}

export default Feed
