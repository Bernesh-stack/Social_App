import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const UserList = ({ datas }: { datas: any }) => {
  return (
    <div className="w-[303px] h-[319px] bg-[#111827] rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col justify-center items-center p-4">
      <Link to={`/profile/${datas.$id}`} className="flex flex-col items-center">
        <img
          src={datas.imageUrl}
          className="rounded-full w-20 h-20 border-2 border-purple-500"
          alt="User Avatar"
        />
        <h2 className="mt-3 text-lg font-semibold text-white">{datas.name}</h2>
        <p className='mt-2'>@{datas.username}</p>
  
      <Button className="shad-button_primary px-6 mt-3">Info</Button>
      </Link>
    </div>
  );
};

export default UserList;
