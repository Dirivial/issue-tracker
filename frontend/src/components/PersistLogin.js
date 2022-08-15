import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hooks/useRefreshToken.js';
import useAuth from '../hooks/useAuth.js';

export default function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.log(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.token && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [auth?.token, persist, refresh]);

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}
