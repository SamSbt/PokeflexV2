import { useAuthStore } from "../store/authStore";
import { Outlet } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

export default function CheckRoles({ allowedRoles }) {
	const { userRole } = useAuthStore();
	console.log(userRole);
	// console.log("checkroles username :", username);

	if (!userRole) {
		// gestion du cas où l'utilisateur n'est pas connecté
		return (
			<div className="text-center mt-5">
				<NotFoundPage />
			</div>
		);
	}

	const hasAccess = allowedRoles.some((allowedRole) =>
		userRole.includes(allowedRole)
	);

	if (!hasAccess) {
		// gestion du cas où l'utilisateur n'a pas les droits
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