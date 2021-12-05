import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Feed from './Components/Feed';
import ResetPassword from './Components/ResetPassword'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute'
import { Fragment } from 'react';
import Profile from './Components/Profile';

function App() {

  return (
    <BrowserRouter>
      <Fragment>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route exact path='/' element={<PrivateRoute />}>
                <Route exact path='/' element={<Feed />} />
              </Route>
            </Routes>
          </div>
        </AuthProvider>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
