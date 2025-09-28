



import { Menu, Rocket } from "lucide-react"; // Changed from School to Rocket
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 bg-white/80 dark:bg-[#020817]/80 backdrop-blur-md border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-50 shadow-sm">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
            <Rocket size={28} className="text-white" />
          </div>
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Skillify
            </h1>
          </Link>
        </div>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group">
                  <Avatar className="ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition-all">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                      className="group-hover:opacity-90"
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-xl">
                <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg">
                    <Link to="my-learning" className="w-full py-1.5">
                      My learning
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg">
                    <Link to="profile" className="w-full py-1.5">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logoutHandler}
                    className="cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer bg-gradient-to-r from-blue-500/10 to-indigo-600/10 hover:from-blue-500/20 hover:to-indigo-600/20 mt-2 rounded-lg">
                      <Link to="/admin/dashboard" className="w-full py-1.5 font-medium text-blue-600 dark:text-blue-400">
                        Instructor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md"
              >
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-6 h-full">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-1.5 rounded-md">
            <Rocket size={24} className="text-white" />
          </div>
          <h1 className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Skillify
          </h1>
        </div>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({user}) => {
  const navigate = useNavigate();
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  
  const logoutHandler = async () => {
    await logoutUser();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white/95 dark:bg-[#0f172a] backdrop-blur-lg">
        <SheetHeader className="flex flex-row items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
              <Rocket size={24} className="text-white" />
            </div>
            <SheetTitle className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-2xl">
              Skillify
            </SheetTitle>
          </div>
          <DarkMode />
        </SheetHeader>
        
        <div className="flex-1 flex flex-col mt-8 space-y-1">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                <Avatar className="ring-2 ring-blue-500/50">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
              
              <SheetClose asChild>
                <Link to="/my-learning" className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  My Learning
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/profile" className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Edit Profile
                </Link>
              </SheetClose>
              {user?.role === "instructor" && (
                <SheetClose asChild>
                  <Link to="/admin/dashboard" className="py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-600/10 hover:from-blue-500/20 hover:to-indigo-600/20 text-blue-600 dark:text-blue-400 font-medium">
                    Instructor Dashboard
                  </Link>
                </SheetClose>
              )}
              <button 
                onClick={logoutHandler}
                className="py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left mt-4"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-6">
              <SheetClose asChild>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  Login
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button 
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md"
                >
                  Signup
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};