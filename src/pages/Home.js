import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import SmoothieCard from "../components/SmoothieCard";

const Home = () => {
  const [error, setError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");

  const handleDelete = (id) => {
    setSmoothies((prevSmoothies) => {
      return prevSmoothies.filter((sm) => sm.id !== id);
    });
  };
  // to get the data in error,smoothies
  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setError("could not fetch smoothies");
        setSmoothies(null);
        console.log(error);
      }
      if (data) {
        setSmoothies(data);
        setError(null);
      }
    };
    fetchSmoothies();
  }, [orderBy]);

  // real time stuff
  useEffect(() => {
    const channel = supabase
      .channel("realtime-smoothies")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "smoothies" },
        (payload) => {
          console.log("Realtime payload:", payload);

          if (payload.eventType === "INSERT") {
            setSmoothies((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "UPDATE") {
            setSmoothies((prev) =>
              prev.map((sm) => (sm.id === payload.new.id ? payload.new : sm))
            );
          }

          if (payload.eventType === "DELETE") {
            setSmoothies((prev) =>
              prev.filter((sm) => sm.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="page home">
      {error && <p>{error}</p>}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("title")}>Title</button>
            <button onClick={() => setOrderBy("rating")}>Rating</button>
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
