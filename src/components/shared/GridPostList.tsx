import { useUserContext } from '@/context/AuthContext';
import { Models } from 'appwrite';
import React from 'react';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type GridPostListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

const GridPostList = ({ posts, showStats = true, showUser = true }: GridPostListProps) => {
    const { user } = useUserContext();
    console.log(posts);

    return (
        <ul className="grid-container">
            {posts.map((post) => {
                // ✅ Handle missing image URLs safely
                const imageUrl =
                    post.imageUrl && !post.imageUrl.includes("storage_image_transformations_blocked")
                        ? post.imageUrl
                        : "/assets/images/default-post.jpg"; // Fallback image for posts

                const creatorImageUrl =
                    post.creator?.imageUrl &&
                    !post.creator.imageUrl.includes("storage_image_transformations_blocked")
                        ? post.creator.imageUrl
                        : "/assets/images/default-avatar.png"; // Fallback avatar

                return (
                    <li key={post.$id} className="relative min-w-80 h-80">
                        <Link to={`/posts/${post.$id}`} className="grid-post_link">
                            <img src={imageUrl} alt="post" className="h-full w-full object-cover" />
                        </Link>
                        <div className="grid-post_user">
                            {showUser && post.creator && (
                                <div className="flex items-center justify-start gap-2 flex-1">
                                    <img src={creatorImageUrl} alt="creator" className="h-8 w-8 rounded-full" />
                                    <p className="line-clamp-1">{post.creator.name}</p>
                                </div>
                            )}

                            {showStats && <PostStats post={post} userId={user.id} />}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default GridPostList;
