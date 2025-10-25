import type { RootState } from "../store";

export const getUserData = ((state: RootState) => state.user)