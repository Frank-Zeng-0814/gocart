import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchRatings = createAsyncThunk(
    'rating/fetchRatings',
    async (token, thunkAPI) => {
        try {
            const { data } = await axios.get('/api/rating', {
                headers: { Authorization: `Bearer ${token}` }
            })
            return data.ratings
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
        loading: false,
        error: null,
    },
    reducers: {
        addRating: (state, action) => {
            state.ratings.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRatings.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRatings.fulfilled, (state, action) => {
                state.loading = false
                state.ratings = action.payload
                state.error = null
            })
            .addCase(fetchRatings.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer