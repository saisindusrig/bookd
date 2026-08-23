import { useAuth } from "../context/AuthContext";
import { useState, type FormEvent } from "react"
import { loginUser } from "../api/auth"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("");
    const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault();
         setError("");
    setSuccess("");

    try {
      const result = await loginUser({
        email,
        password
      });
      if(!result.token){
        throw new Error("Login succeeded but no token was returned")
      }
     login(result.token, result.user)
     setSuccess("Login Successfully")
      navigate("/")
      
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
    }
  return (
    <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6">
            <h1 className="font-heading text-3xl">Welcome Back</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

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

        <button
          type="submit"
          className="w-full bg-primary px-4 py-3 text-background"
        >
          Login
        </button>
        <span>Don't have an account? Click <Link to="/signup" className="underline">here</Link> to Register</span>
        </form>
    </div>
  )
}

export default Login
