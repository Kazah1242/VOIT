import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async actions
export const fetchVotes = createAsyncThunk(
  'votes/fetchVotes',
  async () => {
    const response = await api.get('/votes');
    return response.data;
  }
);

export const createVote = createAsyncThunk(
  'votes/createVote',
  async (voteData) => {
    const response = await api.post('/votes', voteData);
    return response.data;
  }
);

export const submitVote = createAsyncThunk(
  'votes/submitVote',
  async ({ voteId, selectedOption }) => {
    const response = await api.post('/votes/submit', { voteId, selectedOption });
    return response.data;
  }
);

const votesSlice = createSlice({
  name: 'votes',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default votesSlice.reducer; 