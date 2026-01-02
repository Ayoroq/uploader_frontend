import App from '../App.jsx';
import Home from '../pages/Home.jsx'
import AuthHome from '../pages/AuthHome.jsx'
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
        children: [
            {
                index: true,
                element: <ConditionalHome />
            }
        ]
    }
]

export default routes;