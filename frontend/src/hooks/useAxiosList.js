import useAxiosPrivate from './useAxiosPrivate.js'
import { useNavigate, useLocation } from 'react-router-dom';

export default function useAxiosList() {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const axiosList = async (path, payload) => {

        try {
            if (payload) {
                const response = await axiosPrivate.post(path, payload, {withCredentials: true});
                return response?.data;
            } else {
                const response = await axiosPrivate.get(path);
                return response?.data;
            }
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
            return null;
        }
    }

    return axiosList;
}
