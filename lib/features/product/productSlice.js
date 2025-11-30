import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ storeId }, thunkAPI) => {
    try {
      const { data } = await axios.get(
        "/api/product" + (storeId ? `?storeId=${storeId}` : "")
      );
      return data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload;
    },
    clearProduct: (state) => {
      state.list = [];
    },
    addProductRating: (state, action) => {
      const { productId, rating } = action.payload;
      const product = state.list.find((p) => p.id === productId);
      if (product) {
        product.rating.push(rating);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setProduct, clearProduct, addProductRating } = productSlice.actions;

export default productSlice.reducer;
