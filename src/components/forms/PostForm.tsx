import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { toast, useToast } from "@/hooks/use-toast";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import { updatePost } from "@/lib/appwrite/api";

type PostFormProps = {
  post:Models.Document;
  action:'Create' | 'Update'
}

const PostForm = ({ action,post }:PostFormProps) => {
     const {mutateAsync: createPost,isPending:isLoadingCreate} = useCreatePost();
     const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();


    //  
     const {user} = useUserContext()
     const {toast} = useToast()
     const navigate = useNavigate();






  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {

      caption: post?post?.caption :"",
      file: [],
      location: post? post?.location:"",
      tags: post? post?.tags.join(","):"",
    },
  });

 async function onSubmit(values: z.infer<typeof PostValidation>) {
  if(post && action ==="Update"){
    const updatedPost = await updatePost({
      ...values,
      postId:post.$id,
      imageId:post?.imageId,
      imageUrl: post?.imageUrl,
    })

    if(!updatedPost){
      toast({title:"Please try again "})
    }
    return navigate(`/`)

  }
      const newPost = await createPost({
      ...values,
      userId:user.id,
      })

      if(!newPost){
        toast({
          title:"please try again "
        })
      }
      navigate("/")

  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        {/* Caption */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* ✅ File Uploader - Fixed `field.onChange` issue */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Location Input */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Tags Input */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Expression, Learn, JSONs"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-3 justify-end items-center">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
            >
              {isLoadingCreate || isLoadingUpdate && 'Loading....'}
              {action}post
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
