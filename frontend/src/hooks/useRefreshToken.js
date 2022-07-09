import axios from '../api/axios.js';
import useAuth from './useAuth.js';

export default function useRefreshToken() {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.token);
            return {...prev, userid: response.data.userid, token: response.data.token}
        });
        return response.data.token;
    }
    return refresh;
}
