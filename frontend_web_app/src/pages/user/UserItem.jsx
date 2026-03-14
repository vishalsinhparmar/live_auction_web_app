import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  liveAuctionData,
  resetAuthState,
  startAuctionDataAsync,
} from "../../features/auction/auctionSlice";
import {
  deleteUserAuctionItemAsync,
  resetUserItemState,
  updateUserAuctionItemAsync,
  userAuctionItemAsync,
} from "../../features/auction/userSlice";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDateValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const createEditState = (item) => ({
  title: item.title || "",
  description: item.description || "",
  startingPrice: item.startingPrice || "",
  startTime: formatDateValue(item.startTime),
  endTime: formatDateValue(item.endTime),
  image: null,
});

const UserItem = () => {
  const dispatch = useDispatch();
  const { loading, error, auctionItemData, message } = useSelector((state) => state.userItem);
  const { message: auctionMessage, error: auctionError } = useSelector((state) => state.auction);

  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [deletingAuctionId, setDeletingAuctionId] = useState(null);
  const editImageInputRef = useRef(null);

  useEffect(() => {
    dispatch(userAuctionItemAsync());
  }, [dispatch]);

  useEffect(() => {
    if (auctionMessage?.startAuctionDataAsync && selectedAuctionId) {
      toast.success(auctionMessage.startAuctionDataAsync);
      dispatch(userAuctionItemAsync());
      dispatch(liveAuctionData());
      setSelectedAuctionId(null);
      dispatch(resetAuthState());
    }

    if (auctionError?.startAuctionDataAsync && selectedAuctionId) {
      toast.error(auctionError.startAuctionDataAsync || "Failed to start auction.");
      setSelectedAuctionId(null);
      dispatch(resetAuthState());
    }
  }, [auctionError, auctionMessage, dispatch, selectedAuctionId]);

  useEffect(() => {
    if (message.updateUserAuctionItemAsync) {
      toast.success(message.updateUserAuctionItemAsync);
      setEditingItem(null);
      setEditForm(null);
      setEditPreview(null);
      dispatch(resetUserItemState());
    }

    if (message.deleteUserAuctionItemAsync) {
      toast.success(message.deleteUserAuctionItemAsync);
      setDeletingAuctionId(null);
      dispatch(resetUserItemState());
    }

    if (error.updateUserAuctionItemAsync) {
      toast.error(error.updateUserAuctionItemAsync);
      dispatch(resetUserItemState());
    }

    if (error.deleteUserAuctionItemAsync) {
      toast.error(error.deleteUserAuctionItemAsync);
      setDeletingAuctionId(null);
      dispatch(resetUserItemState());
    }
  }, [dispatch, error.deleteUserAuctionItemAsync, error.updateUserAuctionItemAsync, message.deleteUserAuctionItemAsync, message.updateUserAuctionItemAsync]);

  useEffect(() => {
    return () => {
      if (editPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(editPreview);
      }
    };
  }, [editPreview]);

  const handleStartAuction = (id) => {
    setSelectedAuctionId(id);
    dispatch(startAuctionDataAsync({ auctionItemId: id }));
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm(createEditState(item));
    setEditPreview(item.filepath || null);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditForm(null);
    if (editPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editPreview);
    }
    setEditPreview(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditImageChange = (event) => {
    const nextFile = event.target.files?.[0];

    if (!nextFile) return;

    if (editPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editPreview);
    }

    setEditForm((prev) => ({
      ...prev,
      image: nextFile,
    }));
    setEditPreview(URL.createObjectURL(nextFile));
  };

  const handleReplaceImageClick = () => {
    editImageInputRef.current?.click();
  };

  const handleResetEditImage = () => {
    if (editPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(editPreview);
    }

    setEditForm((prev) => ({
      ...prev,
      image: null,
    }));
    setEditPreview(editingItem?.filepath || null);

    if (editImageInputRef.current) {
      editImageInputRef.current.value = "";
    }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("startingPrice", editForm.startingPrice);
    formData.append("startTime", new Date(editForm.startTime).toISOString());
    formData.append("endTime", new Date(editForm.endTime).toISOString());

    if (editForm.image) {
      formData.append("image", editForm.image);
    }

    await dispatch(
      updateUserAuctionItemAsync({
        auctionItemId: editingItem._id,
        formData,
      })
    );
  };

  const handleDelete = async (auctionItemId) => {
    const shouldDelete = window.confirm("Delete this auction item? This action cannot be undone.");

    if (!shouldDelete) return;

    setDeletingAuctionId(auctionItemId);
    await dispatch(deleteUserAuctionItemAsync(auctionItemId));
  };

  const stats = useMemo(() => {
    const items = auctionItemData || [];
    return {
      total: items.length,
      live: items.filter((item) => item.isActive).length,
      pending: items.filter((item) => !item.isActive && !item.winnerId).length,
    };
  }, [auctionItemData]);

  if (loading.fetch) {
    return (
      <div className="empty-state">
        <div>
          <div className="loading-ring mx-auto" />
          <p className="mt-5 text-base font-semibold text-stone-700">Loading your seller inventory...</p>
        </div>
      </div>
    );
  }

  if (error?.userAuctionItemAsync) {
    return (
      <div className="empty-state">
        <p className="text-base font-semibold text-red-600">{error.userAuctionItemAsync}</p>
      </div>
    );
  }

  if (auctionItemData.length === 0) {
    return (
      <div className="empty-state">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone-500">Seller inventory</p>
          <h2 className="headline mt-3 text-3xl font-bold text-stone-950">No auction items found.</h2>
          <p className="mt-3 text-base text-stone-600">Start by creating a listing, then launch it when you are ready to accept bids.</p>
          <NavLink to="/addAuction" className="primary-button mt-6">
            Add auction
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <section className="page-grid">
      {(selectedAuctionId || loading.update || deletingAuctionId) && (
        <div className="overlay">
          <div className="section-card w-full max-w-sm p-8 text-center">
            <div className="loading-ring mx-auto" />
            <p className="mt-5 text-lg font-bold text-stone-950">
              {loading.update
                ? "Saving listing changes..."
                : deletingAuctionId
                  ? "Removing auction item..."
                  : "Starting auction session..."}
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {loading.update
                ? "Updating image, schedule, and price details."
                : deletingAuctionId
                  ? "Cleaning this lot from your seller desk."
                  : "The lot is being moved to the live marketplace."}
            </p>
          </div>
        </div>
      )}

      {editingItem && editForm && (
        <div className="overlay">
          <div className="section-card seller-modal p-5 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Edit listing</p>
                <h2 className="headline mt-2 text-3xl font-bold text-stone-950">Update lot details</h2>
                <p className="mt-2 text-sm text-stone-600">You can change image, pricing, and schedule before the auction goes live.</p>
              </div>
              <button type="button" onClick={handleCloseEdit} className="secondary-button">
                Close
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
              <form onSubmit={handleSubmitEdit} className="grid gap-5">
                <div>
                  <label className="field-label">Title</label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="field-control"
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="field-control min-h-32"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Starting price</label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={editForm.startingPrice}
                      onChange={handleEditChange}
                      className="field-control"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Cover image</label>
                    <div className="rounded-[22px] border border-stone-900/10 bg-white/70 p-3">
                      <div className="preview-media">
                        {editPreview ? (
                          <img src={editPreview} alt={editForm.title} />
                        ) : (
                          <div className="grid h-full place-items-center px-5 text-center text-sm text-stone-500">
                            Add a cover image for this lot.
                          </div>
                        )}
                      </div>
                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <button type="button" onClick={handleReplaceImageClick} className="secondary-button w-full">
                          {editForm.image ? "Replace again" : "Choose image"}
                        </button>
                        <button
                          type="button"
                          onClick={handleResetEditImage}
                          className="secondary-button w-full"
                          disabled={!editForm.image}
                        >
                          Reset image
                        </button>
                      </div>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-stone-400">
                        Single-image cover. Best results come from a clean 4:3 crop.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label">Start time</label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={editForm.startTime}
                      onChange={handleEditChange}
                      className="field-control"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">End time</label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={editForm.endTime}
                      onChange={handleEditChange}
                      className="field-control"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="primary-button w-full" disabled={loading.update}>
                  {loading.update ? "Saving..." : "Save changes"}
                </button>
              </form>

              <aside className="grid gap-4">
                <div className="overflow-hidden rounded-[26px] bg-stone-950 p-4 text-white">
                  <div className="preview-media">
                    {editPreview ? (
                      <img src={editPreview} alt={editForm.title} />
                    ) : (
                      <div className="grid h-full place-items-center px-6 text-center text-sm text-white/70">
                        Upload an image to preview the updated card.
                      </div>
                    )}
                  </div>
                  <h3 className="headline mt-4 text-2xl font-bold">{editForm.title || "Updated lot preview"}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {editForm.description || "Your changes will show here before you save them."}
                  </p>
                </div>

                <div className="metric-card">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Preview price</p>
                  <p className="mt-2 text-lg font-extrabold text-stone-950">{formatCurrency(editForm.startingPrice)}</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      <div className={`page-hero glass-panel items-start transition ${selectedAuctionId ? "blur-sm" : ""}`}>
        <div>
          <span className="eyebrow">Seller desk</span>
          <h1 className="headline mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">Manage your listings with proper seller controls.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Edit pricing and imagery before launch, delete unused lots, and keep the inventory cards clean across mobile and desktop.
          </p>
        </div>

        <div className="inventory-stats sm:grid-cols-3">
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Total lots</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{stats.total}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Live now</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{stats.live}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Ready to start</p>
            <p className="mt-2 text-3xl font-extrabold text-stone-950">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className={`auction-grid transition ${selectedAuctionId ? "blur-sm" : ""}`}>
        {auctionItemData.map((item) => {
          const hasWinner = Boolean(item.winnerId);
          const canManage = !item.isActive && !hasWinner;

          return (
            <article key={item._id} className="section-card inventory-card overflow-hidden">
              <div className="inventory-card__media">
                <img
                  src={item.filepath || "https://via.placeholder.com/640x480?text=No+Image"}
                  alt={item.title}
                />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="headline text-2xl font-bold text-stone-950">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                  </div>
                  <span className={`status-pill ${item.isActive ? "status-pill--live" : "status-pill--closed"}`}>
                    {item.isActive ? "Live" : hasWinner ? "Closed" : "Draft"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="metric-card">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Start price</p>
                    <p className="mt-2 text-lg font-extrabold text-stone-950">{formatCurrency(item.startingPrice)}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Outcome</p>
                    <p className="mt-2 text-lg font-extrabold text-stone-950">
                      {hasWinner ? item.winnerId?.username : item.isActive ? "Receiving bids" : "Not started"}
                    </p>
                  </div>
                </div>

                {hasWinner && !item.isActive && (
                  <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-4">
                    <p className="text-sm font-bold text-amber-900">Closed with winner</p>
                    <p className="mt-1 text-sm text-amber-700">
                      Won by {item.winnerId?.username || "Another bidder"}.
                    </p>
                  </div>
                )}

                <div className="mt-auto grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="secondary-button w-full"
                    disabled={!canManage}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="secondary-button w-full border-red-200 text-red-700"
                    disabled={!canManage || deletingAuctionId === item._id}
                  >
                    {deletingAuctionId === item._id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => handleStartAuction(item._id)}
                    className="primary-button w-full"
                    disabled={!canManage}
                  >
                    Start auction
                  </button>
                </div>

                {!canManage && !item.isActive && hasWinner && (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Closed lots cannot be edited or deleted.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default UserItem;
