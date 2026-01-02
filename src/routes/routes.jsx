import App from '../App.jsx';
import Home from '../pages/Home.jsx'
import AuthHome from '../pages/AuthHome.jsx'


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