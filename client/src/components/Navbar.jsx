import { LogOut, School, Menu, ChartSpline } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import DarkMode from "@/DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";




const Navbar = () => {
  const { user } = useSelector(store => store.auth);

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  }
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logout Successfull")
      navigate("/");
    }

  }, [isSuccess])

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop version */}
      <div className='max-w-7xl mx-auto hidden  md:flex justify-between items-center gap-10 h-full'>
        <div className='flex items-center gap-2'>
          <Link to="/"><School /></Link>
          <Link to="/"><h1 className='hidden md:block font-extrabold text-2xl '>e-Learning</h1></Link>
        </div>
        <div className="flex items-center gap-4">
          {/* user icon and darkmode icon */}
          {/* drop down */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.photoUrl || " https://github.com/shadcn.png"} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem><Link to="/my-learning">My Learning</Link>  </DropdownMenuItem>
                  <DropdownMenuItem><Link to="/profile">Edit Profile</Link>  </DropdownMenuItem>
                  {
                    user?.role === "instructor" && (
                      <DropdownMenuItem> <Link to={`/admin/dashboard`}> DashBoard </Link>  </DropdownMenuItem>
                    )
                  }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>

          ) : (
            <div className='flex items-center gap-2'>
              <Button variant="outline" onClick={() => {
                navigate("/login")
              }}> Login</Button >
              <Button onClick={() => {
                navigate("/login")
              }}
              >Signup</Button>
            </div>
          )
          }
          <DarkMode />
        </div>
      </div>

      {/* Mobile version */}
      <div className="flex md:hidden justify-between items-center h-full px-4">
        <h1 className="font-extrabold"><Link to={"/"}>e-Learning</Link></h1>
        <MobileNavbar user={user} />
      </div>
    </div>

  )
}

export default Navbar


const MobileNavbar = ({user}) => {
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full hover:bg-gray-300" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between  gap-4 p-4 mr-8">
          <SheetTitle><Link to={"/"}>e-Learning</Link></SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DarkMode />
            </DropdownMenuTrigger>
          </DropdownMenu>
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 ml-4">
        <Link to="/my-learning">My Learning</Link>
        <Link to="/profile">Edit Profile</Link>
        <p>Logout</p>
          {
            user?.role === "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit"> <ChartSpline /> <Link to={`/admin/dashboard`}> DashBoard </Link> </Button>
                </SheetClose>
              </SheetFooter>
            )
          }
        </nav>

      </SheetContent>

    </Sheet>
  )
}