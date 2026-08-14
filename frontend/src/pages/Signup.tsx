import { useState, type FormEvent} from "react"
import { signupUser } from "../api/auth"
import { Link } from "react-router-dom";
const Signup = () => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault();
        setError("");
        setSuccess("");
        try{
            const result = await signupUser({
                username,
                email,
                password
            })
            setSuccess(result.message);
            setUsername("");
            setEmail("");
            setPassword("");
        }
        catch(error){
            setError(error instanceof Error? error.message : "Signup Failed");
            
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6">
            <h1 className="font-heading text-3xl">Create Account</h1>
            <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="w-full border p-3"
            />
             <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full border p-3"
            />
             <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full border p-3"
            />
            {error && (
                <p className="text-red-600">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-green-600">
                    {success}
                </p>
            )}
            <button type="submit" className="w-full bg-primary px-4 py-3 text-background">
                Sign up
            </button>
            <span>Already have an account? Click <Link to="/login" className="underline">here</Link> to Log in</span>
        </form>
    </div>
  )
}

export default Signup