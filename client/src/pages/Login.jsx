import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
// import { c } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P"


const Login = () => {
    const navigate = useNavigate();
    const [signupInput, setsignupInput] = useState({ name: "", email: "", password: "" })
    const [loginInInput, setloginInInput] = useState({ email: "", password: "" })

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setsignupInput({ ...signupInput, [name]: value })
        } else {
            setloginInInput({ ...loginInInput, [name]: value })
        }
    }

    const [registerUser, {
        data: registerData,
        error: registerError, isLoading:
        registerIsLoading,
        isSuccess: registerIsSuccess }] = useRegisterUserMutation();
    const [loginUser, { data: loginData,
        error: loginError,
        isLoading: loginIsLoading,
        isSuccess: loginIsSuccess }] = useLoginUserMutation();



    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInInput;
        const action = type === "signup" ? registerUser : loginUser;

        await action(inputData);
    }

    useEffect(() => {
        if(registerIsSuccess && registerData){
            toast.success(registerData.message || "Signp Successful");
        }
        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login Successful");
            navigate("/");

        }

        if(registerError){
            toast.error(registerError.message || "Signup Failed");
        }
        if(loginError){
            toast.error(loginError.message || "Login failed");
        }
      return () => {
        
      }
    }, [loginIsLoading, registerIsLoading, loginError, 
        registerError, registerData, loginData, registerIsSuccess, loginIsSuccess])
    

    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs defaultValue="signup" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUp</TabsTrigger>
                    <TabsTrigger value="Login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Enter your details to create a new account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    onChange={(e) => { changeInputHandler(e, "signup") }}
                                    type="text"
                                    name="name"
                                    value={signupInput.name}
                                    placeholder="Enter your Name" required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    onChange={(e) => { changeInputHandler(e, "signup") }}
                                    type="email"
                                    name="email"
                                    value={signupInput.email}
                                    placeholder="Enter your Email" required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="Password"> Password</Label>
                                <Input
                                    onChange={(e) => { changeInputHandler(e, "signup") }}
                                    id="password"
                                    name="password"
                                    value={signupInput.password}
                                    type="password" required
                                    placeholder="Create a Strong Password"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/* <Button onClick={() => { handleRegistration("signup") }}>Signup</Button> */}
                            <Button disabled={registerIsLoading} onClick={() => { handleRegistration("signup") }}>{
                                registerIsLoading ? <><Loader2  className="mr-2 h-4 w-4 animate-spin"/> </>: "Signup"
                        }</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="Login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Enter your details and press Login
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input onChange={(e) => { changeInputHandler(e, "login") }}
                                    type="email"
                                    name="email"
                                    value={loginInInput.email}
                                    placeholder="Enter your Email" required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input onChange={(e) => { changeInputHandler(e, "login") }}
                                    name="password"
                                    value={loginInInput.password}
                                    type="password"
                                    placeholder="Enter Password" required

                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={() => { handleRegistration("login") }}>{
                                loginIsLoading ? <> <Loader2  className="mr-2 h-4 w-4 animate-spin"/> </>: "Login"
                        }</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default Login;