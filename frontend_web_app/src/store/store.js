import { configureStore } from "@reduxjs/toolkit";
import authFeature from '../features/auth/authSlice';
import auctionFeature from '../features/auction/auctionSlice';
import userFeature from '../features/auction/userSlice'
export const store = new configureStore({
     reducer:{
        auth:authFeature,
        auction:auctionFeature,
        userItem:userFeature
     }
});

