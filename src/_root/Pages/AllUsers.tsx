import UserList from '@/components/shared/UserList';
import { Loader } from 'lucide-react';
import { useUserContext } from '@/context/AuthContext';
import { useGetUsers } from '@/lib/react-query/queriesAndMutations';

const AllUsers = () => {
  const { data: creatorsData, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers();
  const creators = creatorsData?.documents ?? [];
  const user = useUserContext();
  const filteredCreators = creators.filter((creator: any) => creator.$id !== user.user.id);

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto px-10 w-full">
      <h2 className="h3-bold md:h2-bold text-left w-full mt-12">All Users</h2>

      {isUserLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin w-10 h-10 text-primary" />
        </div>
      ) : isErrorCreators ? (
        <p className="text-red-500 text-center mt-10">Failed to load users. Please try again.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full overflow-auto align-middle">
          {filteredCreators.length > 0 ? (
            filteredCreators.map((user: any, index: number) => <UserList key={index} datas={user} />)
          ) : (
            <p className="text-center mt-10">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
