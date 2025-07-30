
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAuctionItem, userWonAuctionItem } from "../../services/services";


// Thunks
export const userAuctionItemAsync = createAsyncThunk('userItem/userAuctionItem',userAuctionItem );
export const userWonAuctionItemAsync = createAsyncThunk('userItem/userWonAuctionItem',userWonAuctionItem );



// console.log('userAuctionItem',userAuctionItemAsync);
// Slice
const userItem = createSlice({
  name: 'userItem',
  initialState: {
    loading: null,
    auctionItemData: [],
    userWonItems: [],
    error: {
      userAuctionItemAsync: null,
      userAuctionWonItemAsync: null,

    },
    message: {
      userAuctionItemAsync: null,
      userAuctionWonItemAsync:null
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
      // Sign Up
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
      // userAuctionWon
      .addCase(userWonAuctionItemAsync.pending, (state) => {
        state.loading = true;
        state.error.userAuctionWonItemAsync = null;
        state.message.userAuctionWonItemAsync = null;
      })
       .addCase(userWonAuctionItemAsync.fulfilled, (state, action) => {
          state.loading = false;
          if (action.payload?.success) {
          state.message.userAuctionWonItemAsync = action.payload.message;
         state.userWonItems = action.payload.data;   // ✅ Store separately
        } else {
       state.error.userAuctionWonItemAsync = action.payload?.message;
    }
     })

      .addCase(userWonAuctionItemAsync.rejected, (state, action) => {
        state.loading = false;
        state.error.userAuctionWonItemAsync = action.error.message;
      })

  }
});

export const { resetAuthState } = userItem.actions;
export default userItem.reducer;