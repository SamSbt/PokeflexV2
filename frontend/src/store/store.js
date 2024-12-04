import create from "zustand";

export const useStore = create((set) => ({
	isLoggedIn: false,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
}));
