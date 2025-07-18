
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addAuctionitemAsync, liveAuctionAsync, startAuctionAsync} from "../../services/services";


// Thunks
export const addAuctionItemDataAsync = createAsyncThunk('auction/addAuctionitem', addAuctionitemAsync);
export const startAuctionDataAsync = createAsyncThunk('auction/startAuction', startAuctionAsync);
export const liveAuctionData = createAsyncThunk('auction/liveAuction', liveAuctionAsync);

console.log('liveAuction',liveAuctionAsync)
// Slice
const authSlice = createSlice({
  name: 'auction',
  initialState: {
    loading: null,
    auctionItem: null,
    error: {
      addAuctionItemDataAsync: null,
      startAuctionDataAsync:null
    },
    message: {
      addAuctionItemDataAsync: null,
      startAuctionDataAsync:null
    }
  },
  reducers: {
    resetAuthState: (state) => {
      state.error = { addAuctionItemDataAsync: null, startAuctionDataAsync: null };
      state.message = { addAuctionItemDataAsync: null, startAuctionDataAsync: null };
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(addAuctionItemDataAsync.pending, (state) => {
        state.loading = true;
        state.error.addAuctionItemDataAsync = null;
        state.message.addAuctionItemDataAsync = null;
      })
      .addCase(addAuctionItemDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.message.addAuctionItemDataAsync = action.payload.message;
        } else {
          state.error.addAuctionItemDataAsync = action.payload?.message;
        }
      })
      .addCase(addAuctionItemDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error.addAuctionItemDataAsync = action.error.message;
      })

  
      .addCase(startAuctionDataAsync.pending, (state) => {
        state.loading = true;
        state.error.startAuctionDataAsync = null;
        state.message.startAuctionDataAsync = null;
      })
      .addCase(startAuctionDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.message.startAuctionDataAsync = action.payload.message;
        } else {
          state.error.startAuctionDataAsync = action.payload?.message;
        }
      })
      .addCase(startAuctionDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error.startAuctionDataAsync = action.error.message;
      })

      // Get Logged-In User
      .addCase(liveAuctionData.pending, (state) => {
        state.loading = true;
        state.error.auctionItem = null;
      })
      .addCase(liveAuctionData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.success) {
          state.auctionItem = action.payload.data;
        } else {
          state.error.login = action.payload?.message;
        }
      })
      .addCase(liveAuctionData.rejected, (state, action) => {
        state.loading = false;
        state.error.login = action.error.message;
      });
  }
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;