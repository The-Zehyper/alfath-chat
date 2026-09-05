import { create } from "zustand";
export type AppUser = { id: string; username: string; display_name: string; avatar_url: string; created_at: string };
interface UserState { user: AppUser | undefined; }
export const useUser = create<UserState>()((set) => ({ user: undefined }));
