import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setMsg("");
    setError("");

    if (!email || !pwd) {
      setError("Please fill in the required fields");
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pwd,
      });
      if (data) {
        console.log(data);
        setMsg("Login Successful");
        navigate("/");
      } else {
        setError(error.message);
      }
    } catch (error) {
      console.log(error);
      setError("Error Logging In");
    } finally {
      setLoading(false);
      setEmail("");
      setPwd("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
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
        {loading ? "processing" : "Login"}
      </button>
      {loading && <p className="">{loading}</p>}
      {msg && <p className="error">{msg}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Don't have an account? <Link to="/signup">SignUp</Link>
      </p>
    </form>
  );
};

export default LoginForm;
