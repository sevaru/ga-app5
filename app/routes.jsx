import App from './components/App.jsx';
import React from 'react';


//TODEL
class LoginHandler extends React.Component { 
  render() {
    return(<div>Welcome to login</div>);
  }
}
//---TODEL



const routes = {
	path: '/',
	component: App,
	childRoutes: [
		{ path: 'login', component: LoginHandler }
	]
};

export default routes;