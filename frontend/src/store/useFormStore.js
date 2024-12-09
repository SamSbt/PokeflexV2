import { create } from "zustand";

const useFormStore = create((set) => ({
	formData: {
		name: "",
		sound: "",
		height: "",
		weight: "",
		type1: "",
		type2: "",
		summary: "",
	},
	types: [], // stockage des types récupérés
	setFormData: (key, value) =>
		set((state) => ({
			formData: { ...state.formData, [key]: value },
		})),
	setTypes: (types) => set({ types }), // mise à jour des types

	setType1: (type1) =>
		set((state) => {
			// Si type1 est changé, vérifier et remettre type2 à vide si c'est le même
			const formData = { ...state.formData, type1 };
			if (formData.type1 === formData.type2) {
				formData.type2 = ""; // On vide type2 si c'est le même type que type1
			}
			return { formData };
		}),

	setType2: (type2) =>
		set((state) => ({
			formData: { ...state.formData, type2 },
		})),

	resetForm: () =>
		set({
			formData: {
				name: "",
				sound: "",
				height: "",
				weight: "",
				type1: "",
				type2: "",
				summary: "",
			},
		}),
}));

// récupération des types et mise à jour dans le store
const fetchTypes = async () => {
	try {
		const response = await fetch("http://localhost:5000/api/type");

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		// console.log("Réponse brute:", data);

		if (data.success) {
			useFormStore.getState().setTypes(data.data);
		} else {
			console.error("Échec de la récupération des types :", data.message);
		}
	} catch (error) {
		console.error("Erreur lors de la récupération des types :", error);
	}
};

export { fetchTypes };
export default useFormStore;
