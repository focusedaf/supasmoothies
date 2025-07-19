import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";

const SmoothieCard = ({ smoothie, onDelete }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.log("Auth error:", error);
      else setUser(data.user);
    };

    getUser();
  }, []);

  const handleDelete = async () => {
    const { error } = await supabase
      .from("smoothies")
      .delete()
      .eq("id", smoothie.id)
      .select();

    if (error) console.log(error);
    else onDelete(smoothie.id);
  };

  const isOwner = user?.email === smoothie.email;

  return (
    <div className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>

    
      {isOwner && (
        <div className="buttons">
          <Link to={"/" + smoothie.id}>
            <i className="material-icons">edit</i>
          </Link>
          <i className="material-icons" onClick={handleDelete}>
            delete
          </i>
        </div>
      )}

      <div className="smoothie-img">
        <img
          src={smoothie.image_url}
          alt={smoothie.title}
          style={{ width: "100%", maxHeight: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default SmoothieCard;
