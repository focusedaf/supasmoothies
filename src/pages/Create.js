import { useState } from "react";
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);
  const [smoothieImg, setSmoothieImg] = useState(null);
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSmoothieImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
const uploadImg = async (file) => {
  const filePath = `${file.name}-${Date.now()}`;

  const { error: uploadError } = await supabase.storage
    .from("smoothie-references")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload failed:", uploadError.message);
    setFormError("Image upload failed");
    return null;
  }

  const { data: publicData } = supabase.storage
    .from("smoothie-references")
    .getPublicUrl(filePath);

  return publicData?.publicUrl || null;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title || !method || !rating) {
      setFormError("Please fill in all the fields correctly");
      return;
    }

    let imgUrl = null;
    if (smoothieImg) {
      imgUrl = await uploadImg(smoothieImg);
      if (!imgUrl) return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setFormError("User not authenticated.");
      return;
    }

    const { data, error } = await supabase
      .from("smoothies")
      .insert([
        {
          title,
          method,
          rating,
          email: user.email,
          image_url: imgUrl,
        },
      ])
      .select();

    if (error) {
      setFormError("Failed to create smoothie. Make sure you are logged in.");
      console.log(error);
      return;
    }

    if (data) {
      console.log("Smoothie created:", data);
      setFormError(null);
      navigate("/");
    }
  };

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <label htmlFor="image">Image:</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        {previewUrl && (
          <div style={{ margin: "1rem 0" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          </div>
        )}

        <button>Create Smoothie Recipe</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default Create;
