import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isPostError } = useGetRecentPosts();
  const { data: creatorsData, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers();
  const { user } = useUserContext();


  const creators = creatorsData?.documents ?? [];


  const filteredCreators = creators.filter((creator: any) => creator.$id !== user?.id).slice(0,5);


  return (
    <div className="flex flex-1">
      {/* Left Section - Home Feed */}
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents?.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>


      {isUserLoading ? (
        <Loader />
      ) : (
        <div className="home-creators">
          <h2 className="h2-bold">Top Trendings</h2>
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 p-4">
              {filteredCreators.map((user: any, index: number) => (
                <UserCard key={index} datas={user} />
              ))}
            </div>
          ) : (
            <p>No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
