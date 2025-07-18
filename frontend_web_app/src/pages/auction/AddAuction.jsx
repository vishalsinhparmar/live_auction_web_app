import { useEffect, useState } from "react";
import { useDispatch,useSelector} from "react-redux";
import { addAuctionItemDataAsync } from "../../features/auction/auctionSlice";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

const AddAuctionItem = () => {
 const navigate = useNavigate();
 const { user } = useSelector((state) => state.auth);
 const { loading, error,message} = useSelector((state) => state.auction);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    startingPrice: "",
  });
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();


      for (const key in form) {
        formData.append(key, form[key]);
      }

      if (file) {
        formData.append("image", file);
      }
     console.log('message',message);
     dispatch(addAuctionItemDataAsync(formData));
     const result = await dispatch(addAuctionItemDataAsync(formData));

    if (result.payload?.success) {
      toast.success(result.payload.message);

      // Reset form and file
      setForm({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        startingPrice: "",
      });
      setFile(null);

      // ✅ Navigate after success
      navigate("/user");
  
     }else{
        toast.error(error.addAuctionItemDataAsync)
     }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong!");
    }
  };
 
    useEffect(() => {
       if (!user) {
        toast.error("You must be logged in to access addauctions");
        navigate("/login");
        return;
      }

       
      }, [dispatch, user, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Auction Item</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        ></textarea>

        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          name="startingPrice"
          placeholder="Starting Price"
          value={form.startingPrice}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
        {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 rounded-full mt-2"
              />
            )}

        <button
          disabled = {loading}
          type="submit"
          className={`px-6 py-2 rounded cursor-pointer ${loading ? 'bg-blue-800 hover:bg-blue-700':'bg-blue-600  text-white hover:bg-blue-700'}`}
        >
         {loading ?"...loading":"Submit Auction"}
        </button>
      </form>
    </div>
  );
};

export default AddAuctionItem;
