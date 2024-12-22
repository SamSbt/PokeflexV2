import { useAuthStore } from "../store/authStore";
import { Outlet } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

export default function CheckRoles({ Allowedroles }) {
	const { userRole } = useAuthStore();
	console.log(userRole);
	// console.log(username);

	if (!userRole) {
		// Gestion du cas où l'utilisateur n'est pas connecté
		return (
			<div className="text-center mt-5">
				<NotFoundPage />
			</div>
		);
	}

	const hasAccess = Allowedroles.some((allowedRole) =>
		userRole.includes(allowedRole)
	);

	if (!hasAccess) {
		// Gestion du cas où l'utilisateur n'a pas les droits
		return (
			<div className="text-center mt-5">
				Vous n'avez pas les droits d'accès à cette page.
			</div>
		);
	}

	return <Outlet />;
}


// outlet protection des routes en front
// que avec react router