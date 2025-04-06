import { use } from "react";
import { z } from "zod"

export const SignupValidation = z.object({
  name:z.string().min(2,{message:"Name must be at least 2 characters."}),
  username: z.string().min(2, {message: "Username must be at least 2 characters.",}),
  email : z.string().email(),
  password: z.string().min(8,{message : 'password must be at least 8 characters.'}),

})


export const SigninValidation = z.object({

  email : z.string().email(),
  password: z.string().min(8,{message : 'password must be at least 8 characters.'}),

})

export const PostValidation = z.object({
  caption:z.string().min(5).max(2200),
  file:z.custom<File[]>(),
  location:z.string().min(2).max(100),
  tags:z.string(),
  


})

export const EditProfileValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z
    .string()
    .max(150, { message: "Bio must be under 150 characters." })
    .optional()
    .default(""),
});


export const ProfileValidation = z.object({

  
  file: z.custom<File[]>(),
  name:z.string().min(2,{message:"Name must be at least 2 characters."}),
  username: z.string().min(2, {message: "Username must be at least 2 characters.",}),
  email : z.string().email(),
  bio:z.string(),

})