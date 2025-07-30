import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuctionItemDataAsync } from "../../features/auction/auctionSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateImageFile } from "../../utils/validateImage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AddAuctionItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.auction);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    startingPrice: "",
  });

  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validation = validateImageFile(selectedFile, 1); // 1 MB max

    if (!validation.valid) {
      toast.warning(validation.message);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a valid image before submitting.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("image", file);

    const result = await dispatch(addAuctionItemDataAsync(formData));

    if (result.payload?.success) {
      toast.success(result.payload.message);
      setForm({ title: "", description: "", startTime: "", endTime: "", startingPrice: "" });
      setFile(null);
      navigate("/user");
    } else {
      toast.error(error?.addAuctionItemDataAsync || "Failed to add auction item");
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to add auctions");
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="relative">
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
            <p className="text-lg text-gray-700 font-semibold">Submitting Auction Item...</p>
          </div>
        </div>
      )}

      <div className={`max-w-3xl mx-auto mt-10 bg-white shadow-xl p-8 rounded-lg transition duration-300 ${isSubmitting ? 'blur-sm' : ''}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add Auction Item</h2>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter item title"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Time Inputs */}
{/* Start Time */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
  <DatePicker
    selected={form.startTime ? new Date(form.startTime) : null}
    onChange={(date) =>
      setForm((prev) => ({
        ...prev,
        startTime: date.toISOString(),
      }))
    }
    showTimeSelect
    timeIntervals={15}
    dateFormat="Pp"
    placeholderText="Select start date & time"
    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

{/* End Time */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
  <DatePicker
    selected={form.endTime ? new Date(form.endTime) : null}
    onChange={(date) =>
      setForm((prev) => ({
        ...prev,
        endTime: date.toISOString(),
      }))
    }
    showTimeSelect
    timeIntervals={15}
    dateFormat="Pp"
    placeholderText="Select end date & time"
    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>


          {/* Starting Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
            <input
              type="number"
              name="startingPrice"
              value={form.startingPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded border"
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded transition duration-300 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Auction Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuctionItem;
