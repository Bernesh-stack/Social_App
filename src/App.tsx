import "./globals.css"
import { Route,Routes } from "react-router-dom";
import SigninForm from "./_auth/Forms/SigninForm";
import SignupForm from "./_auth/Forms/SignupForm";
import { AllUsers, CreatePost, EditPost, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/Pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster"
import Explore from "./_root/Pages/Explore";
import EditProfile from "./_root/Pages/EditProfile";








function App() {
    return (
      <main className="flex h-screen">
        <Routes>

          <Route element={<AuthLayout/>}>
                  <Route element={<SigninForm/>} path="/sign-in"/>
                  <Route element={<SignupForm/>} path="/sign-up"/>

          </Route>

{/* Public  */}
          <Route element={<RootLayout/>}>
                <Route element={<Home/>} index/>
                {/* modified */}
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/saved" element={<Saved/>}/>
                <Route path="/all-users" element={<AllUsers/>}/>
                <Route path="/create-post" element={<CreatePost/>}/>
                <Route path="/update-post/:id" element={<EditPost/>}/>
                <Route path="/posts/:id" element={<PostDetails/>}/>
                <Route path="/profile/:id/*" element={<Profile/>}/>
                {/* <Route path="/update-profile/:id" element={<UpdateProfile/>}/> */}
                <Route path="/all-users" element={<AllUsers/>}/>
                <Route path="/update-profile/:id/*" element={<UpdateProfile/>}/>
          </Route>



          {/* Private */}

        </Routes>
        <Toaster/>
      </main>


    );
  }
  
  export default App