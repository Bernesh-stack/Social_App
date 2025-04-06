import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { INITIAL_USER, useUserContext } from '@/context/AuthContext';

const Topbar = () => {
    const { mutate: signout, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { user, setUser, setIsAuthenticated } = useUserContext(); 

    useEffect(() => {
        if (isSuccess) {
            setUser(INITIAL_USER); 
            setIsAuthenticated(false);
            navigate(0); 
        }
    }, [isSuccess]);

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-3'>
                <Link to={"/"} className='flex items-center gap-3'>
                    <img src='/Assetss/images/logo.svg' width={130} height={325} />
                </Link>

                <div className='flex gap-4'>
                    <Button
                        variant="ghost"
                        className='shad-button_ghost'
                        onClick={() => signout()} // ✅ Calls logout
                    >
                        <img src='/Assetss/icons/logout.svg' />
                    </Button>
                    <Link to={`/profile/${user?.id}`} className='flex-center gap-3'>
                        <img src={user?.imageUrl || '/Assetss/image/profile-placeholder.svg'} className='h-8 w-8 rounded-full' />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Topbar;
