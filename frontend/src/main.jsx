import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/styles/global.scss";
import "../src/assets/styles/app.scss";


createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);


// 1. cd frontend - npm create vite@latest . (le . est pr créer le tt ds le mm fichier)
// 2. npm i
// 3. npm install bootstrap pour le style CSS ET dans main.jsx mettre 
// après ts les autres : import 'bootstrap/dist/css/bootstrap.min.css';
// et react bootstrap pour les composants react déjà stylisés : npm install react-bootstrap
// 4. npm i react-router-dom
// 5. npm install react-icons
// 6. pour séparer la récupérations des données du code, npm i zustand - dossier store/
// et éviter les useState/useEffect qui complexifient, moins performant
// 7. npm install sass