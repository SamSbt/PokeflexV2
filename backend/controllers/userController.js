import AppUser from "../models/AppUser.model.js";
import Role from "../models/Role.model.js";

// Fonction pour mettre à jour le rôle d'un utilisateur
export const putUserRole = async (req, res) => {
	const { userId, newRole } = req.body;

	try {
		// Vérifie si le rôle existe
		const role = await Role.findOne({ name: newRole });
		if (!role) {
			return res.status(400).json({
				success: false,
				message: `Role '${newRole}' not found.`,
			});
		}

		// Met à jour le rôle de l'utilisateur
		const updatedUser = await AppUser.findByIdAndUpdate(
			userId,
			{ role: role._id },
			{ new: true }
		);

		if (!updatedUser) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}

		res.status(200).json({
			success: true,
			message: "User role updated successfully.",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating user role:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
