import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../Styles/resetPassword.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router';


export default function MediaCard() {

    const[email, setEmail] = useState('');
    const {resetPassword} = useContext(AuthContext);
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleClick = async() => {
        setLoading(true);
        await resetPassword(email);
        setSuccess(true);
        setEmail('')
        setTimeout(()=>{
            setSuccess(false);
            navigate('/login');
        }, 3000)
        setLoading(false);
    }

    return (
        <div className="resetWrapper">
            <div className="resetCard">
                <Card variant="outlined">
                    {success && <Alert severity="success">Password Reset Link has been sent to your email!</Alert>}
                    <LockOutlinedIcon style={{ fontSize: "50px", marginTop: "6%" }} />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" >
                            Trouble Logging in ?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your email, phone, or username and we'll send you a link to get back into your account.
                        </Typography>
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin="dense" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </CardContent>
                    <CardActions>
                        <Button color="primary" fullWidth={true} variant="contained" onClick={handleClick} disabled={loading}>
                            Send Login Link
                        </Button>
                    </CardActions>
                    <CardContent>
                        <Typography style={{marginBottom:"10%"}}>
                            or <br></br>
                            <Link to='/signup' style={{textDecoration:"none", color:"black"}}>Create New Account</Link>
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" style={{height:"6vh", marginTop:"2%"}}>
                    <CardContent>
                        <Typography>
                            <Link to='/login' style={{textDecoration:"none", color:"black"}}>Back To Login</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}
