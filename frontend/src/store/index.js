import { configureStore } from '@reduxjs/toolkit';
import votesReducer from './votesSlice';

export const store = configureStore({
  reducer: {
    votes: votesReducer,
  },
}); 