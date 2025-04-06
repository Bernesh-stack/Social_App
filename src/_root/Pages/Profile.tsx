import GridPostList from '@/components/shared/GridPostList'

import { useUserContext } from '@/context/AuthContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutations'

import { Loader } from 'lucide-react'

import { Link, useParams } from 'react-router-dom'



const Profile = () => {
  const { id } = useParams()
  console.log(id)
  const { data: currentUser, isLoading: isUserLoading } = useGetUserById(id || "");
  const {user} = useUserContext()
  let Post_there =currentUser?.posts?.length || 0


  
    if(isUserLoading) {
      return(<Loader/>)
    }



  return (
  

    <div className='mt-8 mr-5 w-full h-full'>
      <h2 className='h3-bold md:h2-bold text-left w-full ml-6'> Profile</h2>

      <div className='flex flex-row gap-x-28 mt-10'>
        <div className='flex flex-row gap-x-8'>
          <img src={currentUser?.imageUrl} className='w-20 h-20 rounded-full' alt="Profile" />

          <div className='flex flex-col gap-y-2'>
            <p className='mt-5 body-bold'>{currentUser?.name || ""}</p>
            <p className='sm-regular text-light-3'>@{currentUser?.username || ""}</p>
            <p className='w-26 sm-regular'>{currentUser?.bio || "No bio details"}</p>
          </div>
        </div>
      </div>
    {user.id === id && (
      <Link to={`/update-profile/${user.id}`}>
      <div className='flex flex-row mt-10 w-full ml-28 gap-4'>
        <img src='/Assetss/icons/edit.svg' alt="Edit"  className='w-8 cursor-pointer'/>
        <p className='sm-regular hover:text-blue-200 cursor-pointer'>Edit Profile</p>
      </div>
      </Link>
      )}

    { Post_there > 0 && (
      <div className='mt-20 flex flex-row'>
        <p>Total Posts:<span className='text-slate-400'> {currentUser?.posts?.length || 0}</span></p>
      </div>
    )
}
      {/* GridPostList Component for Displaying Posts */}
      <div className=' mt-10'>
        {currentUser?.posts?.length ? (
          <GridPostList posts={currentUser.posts} showUser={false} showStats={true} />
        ) : (

<p className='sm-regular text-blue-400 align-middle flex justify-center lg:8'>No post available ☹️</p>

          
        )}
      </div>
    </div>
  )
}

export default Profile
