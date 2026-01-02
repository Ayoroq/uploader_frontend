import App from '../App.jsx';
import Home from '../pages/Home.jsx'
import AuthHome from '../pages/AuthHome.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Error from '../pages/Error.jsx';
import NotAuthorised from '../pages/NotAuthorised.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ConditionalHome() {
    const { user } = useAuth();
    
    if (user) {
        return <AuthHome />
    } else {
        return <Home />
    }
}

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <ConditionalHome />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/403',
                element: <NotAuthorised />
            }
        ]
    }
]

export default routes;