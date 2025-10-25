import { createAsyncThunk } from "@reduxjs/toolkit";

interface PutUserData {
  balance: number;
  wins: number;
  gamesPlayed: number;
  losses: number;
  userId: number;
}

export const putUser = createAsyncThunk(
  "user/putUser",
  async (userData: PutUserData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `https://7437cc39e8e31242.mokky.dev/users/${userData.userId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stats: {
            wins: userData.wins,
            gamesPlayed: userData.gamesPlayed,
            losses: userData.losses,
          },
          card: {
            balance: userData.balance,
          },
        }),
      }
    );

    const data = await res.json();
    console.log("PUT User Response:", data);
    return data;
  }
);
