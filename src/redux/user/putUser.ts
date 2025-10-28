import { createAsyncThunk } from "@reduxjs/toolkit";

interface PutUserData {
  userId: number;
  points: number;
  wins?: number;
  gamesPlayed?: number;
  losses?: number;
}

export const putUser = createAsyncThunk(
  "user/putUser",
  async (userData: PutUserData) => {
    const token = localStorage.getItem("token");

    const updateData: any = {};

    if (
      userData.wins !== undefined ||
      userData.gamesPlayed !== undefined ||
      userData.losses !== undefined
    ) {
      updateData.stats = {};
      if (userData.wins !== undefined) updateData.stats.wins = userData.wins;
      if (userData.gamesPlayed !== undefined)
        updateData.stats.gamesPlayed = userData.gamesPlayed;
      if (userData.losses !== undefined)
        updateData.stats.losses = userData.losses;
    }

    if (userData.points !== undefined) {
      updateData.card = {
        points: userData.points,
      };
    }

    const res = await fetch(
      `https://7437cc39e8e31242.mokky.dev/users/${userData.userId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await res.json();
    return data;
  }
);
