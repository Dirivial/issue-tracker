import { useContext } from 'react';
import AuthContext from '../context.js';

export default function useAuth() {
    return useContext(AuthContext);
}
