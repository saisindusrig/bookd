import { useAuth } from "../context/AuthContext";
import { useState, type FormEvent } from "react"
import { loginUser } from "../api/auth"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
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

      // localStorage.setItem("token", result.token!);

      // setSuccess("Login successful!");

      // console.log("Logged in user:", result.user);
      // console.log("JWT:", result.token);
      // login(result.token!, result.user);
      console.log("1. LOGIN API RESULT:", result);

  console.log("2. TOKEN:", result.token);

  console.log("3. USER:", result.user);

  login(result.token!, result.user);

  console.log(
    "4. LOCAL STORAGE TOKEN:",
    localStorage.getItem("token")
  );
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

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <button
          type="submit"
          className="w-full bg-primary px-4 py-3 text-background"
        >
          Login
        </button>

        </form>
    </div>
  )
}

export default Login