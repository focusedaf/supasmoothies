import React, { useState } from "react";
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    if (!username || !email || !pwd) {
      setError("Please fill in the required fields");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pwd,
        options: {
          data: { username },
        },
      });
      if (data) {
        console.log(data);
        setMsg("Signup Successful. Please check your email to confirm.");
         
      } else {
        setError(error.message);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
      setEmail("");
      setPwd("");
      setUsername("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="user"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "processing" : "Signup"}
      </button>

      {msg && <p className="error">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

export default SignupForm;
