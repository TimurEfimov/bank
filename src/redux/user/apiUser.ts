import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "./types";
import axios from "axios";

export const fetchUserData = createAsyncThunk<User>(
  "user/fetchUserData",
  async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      throw new Error("User ID not found");
    }

    const response = await axios.get(
      `https://7437cc39e8e31242.mokky.dev/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: User = response.data;
    return data;
  }
);
