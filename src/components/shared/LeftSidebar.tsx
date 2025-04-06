import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import {  useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';

const LeftSidebar = () => {
    const { mutate: signout, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, setUser, setIsAuthenticated } = useUserContext(); 

    useEffect(() => {
        if (isSuccess) {
            setUser({
                $id: '',
                id: '',
                name: '',
                username: '',
                email: '',
                imageUrl: '',
                bio: '',
            }); 
            setIsAuthenticated(false);
            navigate(0); 
        }
    }, [isSuccess]);

    console.log("User: from the left side bar ", user);

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                {/* Logo */}
                <Link to={"/"} className='flex items-center gap-3'>
                    <img src='/Assetss/images/logo.svg' width={170} height={36} alt="App Logo" />
                </Link>

                {/* Profile Section */}
                <Link to={`/profile/${user.id}`} className='items-center gap-3 flex'>
                    <img 
                        src={user.imageUrl && user.imageUrl.trim() !== "" ? user.imageUrl : "/Assetss/images/default-avatar.png"} 
                        className='h-14 w-14 rounded-full' 
                        alt='Profile'
                    />
                    <div className='flex flex-col'>
                        <p className='body-bold'>{user.name || "Unknown User"}</p>
                        <p className='sm-regular text-light-3'>@{user.username || "unknown"}</p>
                    </div>
                </Link>

                {/* Edit Profile Link (Only show if user exists) */}
                {user && user.id && (
                    <Link to={`/update-profile/${user.id}`} className='flex items-center gap-5'>
                        <img src="/Assetss/icons/edit.svg" className='h-10 w-8 ml-2' alt="Edit Profile" />
                        <p className='sm-regular text-light-3'>Edit Profile</p>
                    </Link>
                )}

                {/* Sidebar Navigation */}
                <ul className='flex flex-col gap-6'>
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li key={link.label} className={`leftsidebar-link ${isActive ? 'bg-primary-500' : ''}`}>
                                <NavLink to={link.route} className="flex gap-4 items-center p-4">
                                    {link.label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Logout Button */}
            <Button
                variant="ghost"
                className='shad-button_ghost'
                onClick={() => signout()} 
            >
                <img src='/Assetss/icons/logout.svg' alt="Logout Icon" />
                <p className='small-medium lg:base-medium'>Logout</p>
            </Button>
        </nav>
    );
};

export default LeftSidebar;
