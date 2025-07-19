import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MobileWarning from "./components/MobileWarning";
// pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import supabase from "./config/supabaseClient";


function App() {
  const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
     const checkMobile = () => {
       setIsMobile(window.innerWidth <= 500); 
     };

     checkMobile();
     window.addEventListener("resize", checkMobile);
     return () => window.removeEventListener("resize", checkMobile);
   }, []);

  const [user, setUser] = useState(null);

  // check session on load
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    // cleanup
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogut = async () => {
    const { data } = await supabase.auth.signOut();
    setUser(null);
  };
return (
  <BrowserRouter>
    {isMobile ? (
      <MobileWarning />
    ) : (
      <>
        <nav>
          <h1>Supa Smoothies</h1>
          <Link to="/">Home</Link>
          {user && <Link to="/create">Create New Smoothie</Link>}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
          {user && (
            <button type="submit" id="logout" onClick={handleLogut}>
              Logout
            </button>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/:id" element={<Update />} />
        </Routes>
      </>
    )}
  </BrowserRouter>
);
}

export default App
