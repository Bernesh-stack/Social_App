import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending) {
    return <Loader />;
  }

  if (!post) {
    return <p className="text-center text-red-500">Post not found</p>; // Handle undefined case
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start items-start w-full">
          <img src="/assets/icons/add-post.svg" height={36} width={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit a post</h2>
        </div>

        {/* Only render PostForm when post is available */}
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};
export default EditPost