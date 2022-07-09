import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';
import Container from './pages/Container';
import Login from './pages/Login';

// Components
import Navbar from './components/navbar.js';
import RequireAuth from './components/RequireAuth.js';
import PersistLogin from './components/PersistLogin.js';


export default function App() {

    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                {/* Public */}
                <Route path="login" element={<Login />} />
                <Route path="about" element={<About />} />

                {/* Protected routes */}
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Home />} />
                        <Route path="containers" element={<ContainerList />} />
                        <Route path="containers/:id" element={<Container />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
