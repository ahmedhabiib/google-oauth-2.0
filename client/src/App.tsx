import axios from 'axios';
import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import {  Switch, Route, Link,useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'

import styled from 'styled-components'
import { Success } from './containers/index';
import { setAuthUser, setIsAuthenticated } from './context/appSlice';
 

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 31px;
`;

const App: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: any) => state .app.authUser as any) as any
  
  const fetchAuthUser = async () => {
    const response = await axios.get('http://localhost:5000/api/v1/auth/user', {withCredentials: true}).catch((err) => {
      console.log('Not properly authenticated');
      dispatch(setIsAuthenticated(false))
      dispatch(setAuthUser(null))
      history.push('/login/error')
    });

    if(response && response.data){
      console.log('User : ', response.data );
      dispatch(setIsAuthenticated(true))
      dispatch(setAuthUser(response.data))
      history.push('/welcome')
    }
  }

  const redirectToGoogleSSO = async () => {
    let timer: NodeJS.Timeout | null = null;
    const googleLoginUrl = 'http://localhost:5000/api/v1/login/google'
    const newWindow = window.open(googleLoginUrl, '_blank', "width=400,height=500");

    if(newWindow){
      timer = setInterval(()=>{
        if(newWindow.closed){
          console.log("Yep we're authenticated");
          fetchAuthUser()
          if(timer){
            clearInterval(timer)
          }
        }
      }, 5000)
    }
  }
  
  
  return (
    <AppContainer>
        <Switch>
          <Route path="/"  exact>
            Welcome Home!, 
            <Link to='/login'>Login</Link>
          </Route>
          <Route path='/login' exact>
            <GoogleButton onClick={redirectToGoogleSSO} />
          </Route>
          <Route path='/welcome'>
          Welcome Back, {user && user.fullName}
          </Route>  
          <Route path='/login/success' component={Success} />
          <Route path='/login/error'>
            <h1>Erro Login, Please try agian later!</h1>
          </Route>
          <Route path='*'>
            <h1>Nof Found</h1>
          </Route>

        </Switch>
    </AppContainer>
  )
}

export default App;
