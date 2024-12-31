import PropTypes from "prop-types";
import { useAuthStore } from "../store/authStore";
import { Image } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";

export default function CheckRoles({ allowedRoles }) {
	const { userRole, isLoggedIn } = useAuthStore();
	const location = useLocation();
	// console.log(userRole);
	// console.log("checkroles username :", username);

	// si utilisateur non connecté et qu'il veut accéder à la page de création
	if (!isLoggedIn) {
		if (location.pathname === "/create") {
			return (
				<div className="mt-5 text-center">
					<h6 className="mx-4">
						Pour créer vos propres Pokéflons, connectez-vous !
					</h6>
					<Image
						alt="Logo de DevFreak blanc et noir"
						src="/images/dev-freak_logo-void.png"
						width="100"
						className="mt-3"
					/>
				</div>
			);
		}
	}

	if (!userRole) {
		// gestion du cas où l'utilisateur n'est pas connecté
		return <NotFoundPage />;
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

CheckRoles.propTypes = {
	allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// outlet protection des routes en front
// que avec react router
