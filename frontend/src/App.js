import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ContainerList from './pages/ContainerList';
import Container from './pages/Container';
import Login from './pages/Login';

// Components
import Navbar from './components/navbar';
import RequireAuth from './components/RequireAuth.js';


export default function App() {

    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                {/* Public */}
                <Route path="login" element={<Login />} />
                <Route path="about" element={<About />} />

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Home />} />
                    <Route path="container-list" element={<ContainerList />} />
                    <Route path="example-container" element={<Container />} />
                </Route>
            </Route>
        </Routes>
    );
}
