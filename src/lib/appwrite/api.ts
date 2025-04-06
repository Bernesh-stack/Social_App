import { ID, Query } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { useUserContext } from "@/context/AuthContext";




// ===============================================
// AUTH
// ===============================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log("Error in createUserAccount:", error);
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log("Error in saveUserToDB:", error);
    return null;
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log("Error in signInAccount:", error);
    return null;
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.log("Error in getAccount:", error);
    return null;
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const session = await account.getSession("current");
    console.log("Active session:", session);

    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No active account");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser || currentUser.documents.length === 0)
      throw new Error("User not found in DB");

    return currentUser.documents[0];
  } catch (error) {
    console.log("Error in getCurrentUser:", error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("user");
  } catch (error) {
    console.log("Error in signOutAccount:", error);
  }
}

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error("File upload failed");

    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("File URL not found");
    }

    const tags = post.tags?.split(/[\s,]+/) || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Post creation failed");
    }

    return newPost;
  } catch (error) {
    console.log("Error in createPost:", error);
    return null;
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log("Error in uploadFile:", error);
    return null;
  }
}

// ============================== GET FILE PREVIEW (FIXED ✅)
export async function getFilePreview(fileId: string) {
  try {
    // ✅ Uses getFileView instead of getFilePreview (no transformation)
    const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    return fileUrl.toString();
  } catch (error) {
    console.log("Error in getFilePreview:", error);
    return null;
  }
}
// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log("Error in deleteFile:", error);
  }
}
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"),Query.limit(20) ]


  )
  if (!posts) throw new Error("No posts found");
  return posts;
}


export async function likePost(postId:string,likesArray:string[]){
  try{
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,{
        likes:likesArray
      }

    )
    if(!updatedPost) throw Error;

    return updatedPost

  }
  catch(error){
    console.log(error);
  }
}


export async function savePost(postId:string,userId:string){
  try{
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),{
        user:userId,
        post:postId,
      }

    )
    if(!updatedPost) throw Error;

    return updatedPost

  }
  catch(error){
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId:string){
  try{
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId);
    if(!statusCode) throw Error;

    return {status:"ok"}

  }
  catch(error){
    console.log(error);
  }
}

export async function getPostById(postId:string){

  try{
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post;
  }
  catch(error){
    console.log(error);
  }
}


//   ////////////



export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


// 

export async function deletePost(postId: string,imageId:string) {
  if(!postId || !imageId) throw Error;

  try{
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return{status:"ok"}

  }catch(error){
    console.log("ivan varuvana")

  }
}

export async function getInfinitePosts({pageParam}:{pageParam:number}) {

const queries:any[] = [Query.orderDesc("$updatedAt"),Query.limit(10)]
if(pageParam){
  queries.push(Query.cursorAfter(pageParam.toString()));
}
try{
  const post = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    queries
  )

  if(!post) throw "I am from infinite scrol ";
  return post

}
catch(error){
  console.log(error)
}
 
  
}



export async function searchPost(searchTerm:string) {

  try{
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption',searchTerm)]
    )
  
    if(!post) throw "i am from the search Post";
    return post
  
  }
  catch(error){
    console.log(error)
  }
   
    
  }
  
  // nee panurahtu

// export async function getInfiniteUsers(){
//   try {
//     const users = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.limit(20)]

//     )
//     if (!users) throw error 
//     return users;
//   } catch (error) {
//     console.log(error)
//   }


// }

export async function getUsers() {
  try{
  const users = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,

    

  )
  return users
}
catch(error){
  console.log("error from the api of getUsers")
}


// }
// export async function getUserPosts(userId?: string) {
//   if (!userId) return;

//   try {
//     const post = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
//     );

//     if (!post) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//   }
// }


}
export const getSavedPosts = async () => {
  const user =  useUserContext()
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.savesCollectionId,
      [Query.equal('userId',user.user.id )]
    );
    return response.documents;
  } catch (error) {
    console.error('Failed to fetch saved posts:', error);
    throw new Error('Failed to fetch saved posts');
  }
};




export const UpdateProfile = async () =>{
  const ActiveUser = useUserContext()
  try{
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ActiveUser.user.id,
      // updates
    )
    return updatedUser

  }
  catch(error){
    console.log("dai nee etho update apila tappu panni iruka ")
  }
}
export async function updateUser(user: IUpdateUser) {
  try {
    const hasFileToUpdate = user.file.length > 0;
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw new Error("File upload failed");

      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("File preview failed");
      }

      image = { imageUrl: fileUrl.toString(), imageId: uploadedFile.$id }; // ✅ FIXED
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl, // ✅ now a string
        imageId: image.imageId,
      }
    );

    if (!updatedUser) {
      if (hasFileToUpdate) await deleteFile(image.imageId);
      throw new Error("User update failed");
    }

    if (user.imageId && hasFileToUpdate) await deleteFile(user.imageId);

    return updatedUser;
  } catch (error) {
    console.error("Update User Error: ", error);
    return null;
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    console.error("Get User Error: ", error);
    return null;
  }
}