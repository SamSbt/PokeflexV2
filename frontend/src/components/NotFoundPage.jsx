import React from 'react'
import { Image } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
		<div className="mt-5 text-center">
			<h6 className="mx-4 mb-4">
				Oups ! Cette page n'existe pas. <br /><br />
        Retournez à l'accueil pour continuer
				votre aventure !
			</h6>
			<Image
				alt="Logo de DevFreak blanc et noir"
				src="/images/dev-freak_logo-void-tear.png"
				width="100"
				className="mt-3"
			/>
		</div>
	);
}

export default NotFoundPage