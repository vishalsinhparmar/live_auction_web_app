import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteAuctionItemAsync,
  updateAuctionItemAsync,
  userAuctionItem,
  userWonAuctionItem,
} from "../../services/services";

export const userAuctionItemAsync = createAsyncThunk("userItem/userAuctionItem", userAuctionItem);
export const userWonAuctionItemAsync = createAsyncThunk("userItem/userWonAuctionItem", userWonAuctionItem);
export const updateUserAuctionItemAsync = createAsyncThunk(
  "userItem/updateAuctionItem",
  updateAuctionItemAsync
);
export const deleteUserAuctionItemAsync = createAsyncThunk(
  "userItem/deleteAuctionItem",
  deleteAuctionItemAsync
);

const initialErrorState = {
  userAuctionItemAsync: null,
  userAuctionWonItemAsync: null,
  updateUserAuctionItemAsync: null,
  deleteUserAuctionItemAsync: null,
};

const initialMessageState = {
  userAuctionItemAsync: null,
  userAuctionWonItemAsync: null,
  updateUserAuctionItemAsync: null,
  deleteUserAuctionItemAsync: null,
};

const userItem = createSlice({
  name: "userItem",
  initialState: {
    loading: {
      fetch: false,
      update: false,
      delete: false,
      won: false,
    },
    auctionItemData: [],
    userWonItems: [],
    error: initialErrorState,
    message: initialMessageState,
  },
  reducers: {
    resetUserItemState: (state) => {
      state.error = initialErrorState;
      state.message = initialMessageState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAuctionItemAsync.pending, (state) => {
        state.loading.fetch = true;
        state.error.userAuctionItemAsync = null;
      })
      .addCase(userAuctionItemAsync.fulfilled, (state, action) => {
        state.loading.fetch = false;
        if (action.payload?.success) {
          state.message.userAuctionItemAsync = action.payload.message;
          state.auctionItemData = action.payload.data;
        } else {
          state.error.userAuctionItemAsync = action.payload?.message;
        }
      })
      .addCase(userAuctionItemAsync.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.userAuctionItemAsync = action.error.message;
      })
      .addCase(userWonAuctionItemAsync.pending, (state) => {
        state.loading.won = true;
        state.error.userAuctionWonItemAsync = null;
      })
      .addCase(userWonAuctionItemAsync.fulfilled, (state, action) => {
        state.loading.won = false;
        if (action.payload?.success) {
          state.message.userAuctionWonItemAsync = action.payload.message;
          state.userWonItems = action.payload.data;
        } else {
          state.error.userAuctionWonItemAsync = action.payload?.message;
        }
      })
      .addCase(userWonAuctionItemAsync.rejected, (state, action) => {
        state.loading.won = false;
        state.error.userAuctionWonItemAsync = action.error.message;
      })
      .addCase(updateUserAuctionItemAsync.pending, (state) => {
        state.loading.update = true;
        state.error.updateUserAuctionItemAsync = null;
        state.message.updateUserAuctionItemAsync = null;
      })
      .addCase(updateUserAuctionItemAsync.fulfilled, (state, action) => {
        state.loading.update = false;
        if (action.payload?.success) {
          state.message.updateUserAuctionItemAsync = action.payload.message;
          state.auctionItemData = state.auctionItemData.map((item) =>
            item._id === action.payload.data._id ? action.payload.data : item
          );
        } else {
          state.error.updateUserAuctionItemAsync = action.payload?.message;
        }
      })
      .addCase(updateUserAuctionItemAsync.rejected, (state, action) => {
        state.loading.update = false;
        state.error.updateUserAuctionItemAsync = action.error.message;
      })
      .addCase(deleteUserAuctionItemAsync.pending, (state) => {
        state.loading.delete = true;
        state.error.deleteUserAuctionItemAsync = null;
        state.message.deleteUserAuctionItemAsync = null;
      })
      .addCase(deleteUserAuctionItemAsync.fulfilled, (state, action) => {
        state.loading.delete = false;
        if (action.payload?.success) {
          state.message.deleteUserAuctionItemAsync = action.payload.message;
          state.auctionItemData = state.auctionItemData.filter(
            (item) => item._id !== action.meta.arg
          );
        } else {
          state.error.deleteUserAuctionItemAsync = action.payload?.message;
        }
      })
      .addCase(deleteUserAuctionItemAsync.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.deleteUserAuctionItemAsync = action.error.message;
      });
  },
});

export const { resetUserItemState } = userItem.actions;
export default userItem.reducer;
