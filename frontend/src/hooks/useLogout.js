import axios from '../api/axios.js';
import useAuth from './useAuth.js';

export default function useLogout() {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});
        try {
            const response = await axios.post('/logout', {}, { withCredentials: true });
        } catch(err) {
            console.error(err);
        }
    }

    return logout;
}
