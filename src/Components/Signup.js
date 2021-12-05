import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../Styles/Signup.css'
import insta from '../Assets/Instagram.jpg'
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { storage, database } from '../firebase';

export default function Signup() {

    const useStyles = makeStyles({
        text1: {
            color: 'grey',
            textAlign: 'center'
        },
        card2: {
            height: '6vh',
            marginTop: '1%'
        }
    })
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const {signup} = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        if (file == null) {
            setError("Please upload profile image first");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        if (email === '' || password === '' || name === '') {
            setError("Please Enter Your Credentials");
            setTimeout(() => {
                setError('')
            }, 2000)
            return;
        }
        try {
            setError('')
            setLoading(true)
            let userObj = await signup(email, password)
            let uid = userObj.user.uid
            const uploadTask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
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
                    console.log(url);
                    database.users.doc(uid).set({
                        email: email,
                        userId: uid,
                        fullname: name,
                        profileUrl: url,
                        createdAt: database.getTimeStamp()
                    })
                })
                setLoading(false);
                navigate('/')
            }
        } catch (err) {
            setError(err);
            setTimeout(() => {
                setError('')
            }, 2000)
        }
    }

    return (
        <div className="signupWrapper">
            <div className="signupCard">

                <Card variant="outlined">
                    <div className="insta-logo">
                        <img src={insta} alt="" />
                    </div>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Sign up to see photos and videos from your friends
                        </Typography>
                        {error !== '' && <Alert severity="error">{error}</Alert>}
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin="dense" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin="dense" size="small" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <TextField id="outlined-basic" label="Full Name" variant="outlined" fullWidth={true} margin="dense" size="small" value={name} onChange={(e) => setName(e.target.value)} />
                        <Button color="secondary" fullWidth={true} variant="outlined" margin="dense" startIcon={<CloudUploadIcon />} component="label">
                            Upload Profile Image
                            <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0])} />
                        </Button>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" fullWidth={true} variant="contained" disabled={loading} onClick={handleClick}>Sign up</Button>
                    </CardActions>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            By signing up, you agree to our Terms, Conditions and Cookies policy.
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" className={classes.card2}>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            Having an account ? <Link to="/login" style={{ textDecoration: 'none', color:"black" }}>Login</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}
