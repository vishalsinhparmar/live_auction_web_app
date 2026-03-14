import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addAuctionItemDataAsync } from "../../features/auction/auctionSlice";
import { validateImageFile } from "../../utils/validateImage";
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

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validation = validateImageFile(selectedFile, 1);

    if (!validation.valid) {
      toast.warning(validation.message);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
  }, [navigate, user]);

  return (
    <section className="page-grid">
      {isSubmitting && (
        <div className="overlay">
          <div className="section-card w-full max-w-sm p-8 text-center">
            <div className="loading-ring mx-auto" />
            <p className="mt-5 text-lg font-bold text-stone-950">Publishing your auction lot...</p>
            <p className="mt-2 text-sm text-stone-600">We are packaging the media, pricing, and schedule.</p>
          </div>
        </div>
      )}

      <div className={`page-hero glass-panel transition ${isSubmitting ? "blur-sm" : ""}`}>
        <div>
          <span className="eyebrow">Seller studio</span>
          <h1 className="headline mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">Launch a listing that feels ready for buyers.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Set an opening price, schedule the sale window, and upload a strong cover image so bidders can evaluate the lot quickly.
          </p>
        </div>

        <div className="inventory-stats">
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Tip</p>
            <p className="mt-3 text-lg font-bold text-stone-950">Use short, descriptive titles and precise close times to improve bid confidence.</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Image limit</p>
            <p className="mt-3 text-lg font-bold text-stone-950">The uploaded image must be under 1 MB and optimized for first impression.</p>
          </div>
        </div>
      </div>

      <div className={`section-card grid gap-8 p-6 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:p-8 ${isSubmitting ? "blur-sm" : ""}`}>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid gap-6">
          <div>
            <label className="field-label">Lot title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Vintage watch, signed print, premium collectible..."
              className="field-control"
              required
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe condition, provenance, standout details, and why bidders should care."
              className="field-control min-h-36"
              rows={5}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="field-label">Start time</label>
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
                placeholderText="Select start date and time"
                className="field-control"
              />
            </div>

            <div>
              <label className="field-label">End time</label>
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
                placeholderText="Select end date and time"
                className="field-control"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Opening price</label>
            <input
              type="number"
              name="startingPrice"
              value={form.startingPrice}
              onChange={handleChange}
              className="field-control"
              placeholder="Starting amount in INR"
              required
            />
          </div>

          <div>
            <label className="field-label">Cover image</label>
            <label className="flex cursor-pointer items-center justify-center rounded-[22px] border border-dashed border-stone-900/20 bg-stone-50/70 px-6 py-8 text-center transition hover:bg-stone-50">
              <div>
                <p className="text-base font-bold text-stone-950">{file ? "Replace image" : "Choose image"}</p>
                <p className="mt-2 text-sm text-stone-500">JPG, PNG, or WebP under 1 MB</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <button disabled={loading} type="submit" className="primary-button w-full">
            {loading ? "Submitting..." : "Publish auction"}
          </button>
        </form>

        <aside className="grid gap-4">
          <div className="rounded-[28px] bg-stone-950 p-4 text-stone-50">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-300">Preview panel</p>
            <div className="preview-media mt-4">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Auction preview" />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute right-3 top-3 rounded-full bg-stone-950/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div className="grid h-full min-h-64 place-items-center px-6 text-center text-sm text-stone-300">
                  Upload a cover image to preview how the listing will appear to bidders.
                </div>
              )}
            </div>
            <div className="mt-4 space-y-3">
              <h2 className="headline text-2xl font-bold">{form.title || "Your next premium lot"}</h2>
              <p className="text-sm leading-6 text-stone-300">
                {form.description || "A concise, credible description helps buyers place stronger bids faster."}
              </p>
            </div>
          </div>

          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Submission state</p>
            <p className="mt-3 text-lg font-bold text-stone-950">{file ? "Image attached and ready." : "Waiting for listing media."}</p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AddAuctionItem;
