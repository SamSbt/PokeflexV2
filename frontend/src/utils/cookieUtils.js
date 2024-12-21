const isSecure = window.location.protocol === "https:";

// Function to set a cookie
export function setCookie(name, value, days) {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	const expires = "expires=" + date.toUTCString();
	const secureFlag = isSecure ? "Secure;" : "";
	const sameSite = "SameSite=Strict;";
	document.cookie = `${name}=${value};${expires};path=/;${secureFlag}${sameSite}`;
}

// Function to get a cookie
export function getCookie(name) {
	const cookies = document.cookie
		.split("; ")
		.map((cookie) => cookie.split("="))
		.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
	return cookies[name] || null;
}

// Function to delete a cookie
export function deleteCookie(name) {
	const secureFlag = isSecure ? "Secure;" : "";
	const sameSite = "SameSite=Strict;";
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${secureFlag}${sameSite}`;
}

// sécurité avec les flags Secure et SameSite
// gestion dynamique du protocole (https vs http)
// à tester en environnement local (http) et en production (https) pour vérifier que tout fonctionne comme prévu