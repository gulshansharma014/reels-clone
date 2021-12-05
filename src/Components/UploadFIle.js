import React,{useState} from 'react'
import { v4 as uuidv4 } from 'uuid'
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { database, storage } from '../firebase';
// import MovieIcon from '@material-ui/icons/Movie';

function UploadFIle(props) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleFile = async (file) => {
        if (file == null) {
            setError('Please select a file first');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        if (file.size / (1024 * 1024) > 500) {
            setError('Maximum file should be of 5Mb');
            setTimeout(() => {
                setError('')
            }, 2000);
            return;
        }
        let uid = uuidv4();
        setLoading(true);
        const uploadTask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
        uploadTask.on('state_changed', fn1, fn2, fn3);
        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress} done.`)
        }
        function fn2(error) {
            setError(error);
            setTimeout(() => {
                setError('')
            }, 2000);
            setLoading(false)
            return;
        }
        function fn3() {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                let obj = {
                    likes: [],
                    comments: [],
                    pId: uid,
                    pUrl: url,
                    uName: props.user.fullname,
                    uProfile: props.user.profileUrl,
                    userId: props.user.userId,
                    createdAt: database.getTimeStamp()
                }
                database.posts.add(obj).then(async (ref) => {
                    await database.users.doc(props.user.userId).update({
                        postIds: props.user.postIds != null ? [...props.user.postIds, ref.id] : [ref.id]
                    })
                }).then(() => {
                    setLoading(false)
                }).catch((err) => {
                    setError(err)
                    setTimeout(() => {
                        setError('')
                    }, 2000)
                    setLoading(false)
                })
            })
        }
    }

    return (
        <div>
            {error !== '' && <Alert severity="error">{error}</Alert>}
            <input type="file" id="upload-input" accept="video/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            <label htmlFor="upload-input">
                <Button variant="outlined" color="secondary" component="span">&nbsp;Upload a video</Button>
            </label>
            {loading && <LinearProgress color="secondary" />}
        </div>
    )
}

export default UploadFIle
