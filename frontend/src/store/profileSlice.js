import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosConfig";

// Async Thunk: Gọi API lấy thông tin Profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Giả sử endpoint backend là /users/profile
      const response = await axiosInstance.get("/users/profile");
      // Backend thường trả về format: { status: 'success', data: { user: {...} } }
      // Tùy theo response thực tế mà ta bóc tách dữ liệu
      return response.data?.user || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi tải thông tin");
    }
  },
);

// Async Thunk: Gọi API cập nhật thông tin Profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/users/profile", userData);
      return response.data?.user || response.data || response;
    } catch (error) {
      return rejectWithValue(error.message || "Cập nhật thất bại");
    }
  },
);

const initialState = {
  user: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateSuccess: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Có thể thêm các reducer đồng bộ ở đây (ví dụ clearError)
    clearStatus: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Xử lý updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.user = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const { clearStatus } = profileSlice.actions;
export default profileSlice.reducer;
