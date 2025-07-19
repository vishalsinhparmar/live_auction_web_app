
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAuctionItem } from "../../services/services";


// Thunks
export const userAuctionItemAsync = createAsyncThunk('userItem/userAuctionItem',userAuctionItem );


// console.log('userAuctionItem',userAuctionItemAsync);
// Slice
const userItem = createSlice({
  name: 'userItem',
  initialState: {
    loading: null,
    auctionItemData: [],
    error: {
      userAuctionItemAsync: null,
    },
    message: {
      userAuctionItemAsync: null,
    }
  },
  reducers: {
    resetAuthState: (state) => {
      state.error = { userAuctionItemAsync: null,};
      state.message = { userAuctionItemAsync: null,};
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(userAuctionItemAsync.pending, (state) => {
        state.loading = true;
        state.error.userAuctionItemAsync = null;
        state.message.userAuctionItemAsync = null;
      })
      .addCase(userAuctionItemAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
            state.message.userAuctionItemAsync = action.payload.message;
            state.auctionItemData = action.payload.data;
        } else {
          state.error.userAuctionItemAsync = action.payload?.message;
        }
      })
      .addCase(userAuctionItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error.userAuctionItemAsync = action.error.message;
      })

  }
});

export const { resetAuthState } = userItem.actions;
export default userItem.reducer;