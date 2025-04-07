import PostForm from "@/components/forms/PostForm"
import { Models } from "appwrite";

const CreatePost = () => {
  const emptyPost: Models.Document = {
    $id: "",
    $createdAt: "",
    $updatedAt: "",
    $collectionId: "",
    $databaseId: "",
    $permissions: [],
    caption: "",
    file: [],
    location: "",
    tags: [],
    imageId: "",
    imageUrl: "",
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start items-start w-full">
          <img src="/assets/icons/add-post.svg" height={36} width={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create a post</h2>
        </div>

        <PostForm action="Create" post={emptyPost} />
      </div>
    </div>
  );
};

export default CreatePost;
