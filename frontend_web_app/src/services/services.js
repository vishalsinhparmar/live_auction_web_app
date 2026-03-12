import axios from "axios";

const api_url = "https://liveauctionwebapp-production.up.railway.app/api";

const api = axios.create({
  baseURL: api_url,
});

const getErrorMessage = (error, fallbackMessage) => {
  const backendMessage = error?.response?.data?.message;
  const axiosMessage = error?.message;

  return backendMessage || axiosMessage || fallbackMessage;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("Unauthorized, redirect to login if required.");
    }

    return Promise.reject(error);
  }
);

const userSignUp = async (form) => {
  try {
    const resData = await api.post("/auth/signUp", form);
    return resData.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to create account."));
  }
};

const userSignIn = async (form) => {
  try {
    const resData = await api.post("/auth/signIn", form);
    return resData.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to sign in."));
  }
};

const loginUserData = async () => {
  try {
    const resData = await api.get("/auth/loginUser");
    return resData.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Unable to load logged-in user."));
  }
};

const addAuctionitemAsync = async (form) => {
  const resData = await api.post("/auction/addAuctionItem", form);
  return resData.data;
};

const startAuctionAsync = async (form) => {
  const resData = await api.patch("/auction/startAuction", form);
  return resData.data;
};

const liveAuctionAsync = async () => {
  const resData = await api.get("/auction/liveAuction");
  return resData.data;
};

const fetchBidData = async (id) => {
  const resData = await api.get(`/bid/bidItem/${id}`);
  return resData.data;
};

const userAuctionItem = async () => {
  const resData = await api.get("/auction/auctionItem");
  return resData.data;
};

const userWonAuctionItem = async () => {
  const resData = await api.get("/auction/won-auctions");
  return resData.data;
};

export {
  userSignUp,
  userSignIn,
  loginUserData,
  addAuctionitemAsync,
  liveAuctionAsync,
  startAuctionAsync,
  userAuctionItem,
  userWonAuctionItem,
  fetchBidData,
};
