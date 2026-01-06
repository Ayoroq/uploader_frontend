import App from '../App.jsx';
import Home from '../pages/Home.jsx'
import AuthHome from '../pages/AuthHome.jsx'
import Login from '../pages/Login.jsx'
import Signup from '../pages/Signup.jsx'
import Error from '../pages/Error.jsx';
import NotAuthorised from '../pages/NotAuthorised.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router';

function ConditionalHome() {
    const { user, loading } = useAuth();
    if (loading) return(null)
    if (user) {
        return <AuthHome />
    } else {
        return <Home />
    }
}

function ProtectedAuthRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return(null);
    return user ? <Navigate to="/" replace /> : children;
}

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return(null);
    return user ? children : <Navigate to="/login" replace />;
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
                path: '/folder',
                element: <Navigate to="/" replace />
            },
            {
                path: '/folders/:folderId',
                element: <ProtectedRoute><AuthHome /></ProtectedRoute>
            },
            {
                path: '/login',
                element: <ProtectedAuthRoute><Login /></ProtectedAuthRoute>
            },
            {
                path: '/signup',
                element: <ProtectedAuthRoute><Signup /></ProtectedAuthRoute>
            },
            {
                path: '/403',
                element: <NotAuthorised />
            }
        ]
    }
]

export default routes;