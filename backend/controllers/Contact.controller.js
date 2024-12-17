import Contact from "../models/Contact.model.js";

export const getContacts = async (req, res) => {
	try {
		const contacts = await Contact.find({}); // empty {} here : fetch ALL types
		res.status(200).json({ success: true, data: contacts });
	} catch (error) {
		console.log("Error in fetching contact(s) message(s):", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postContact = async (req, res) => {
	const { username, email, subject, message } = req.body; // données envoyées par l'utilisateur

	if (!username || !email || !subject || !message) {
		return res.status(400).json({
			success: false,
			message: "Please provide your username, email, subject, and message.",
		});
	}

	// création new contact
	const newContact = new Contact({ username, email, subject, message });

	try {
		console.log("Saving new email to database...");
		await newContact.save();

		// Envoi de l'email
		console.log("Envoi de l'email...");
	// logique pour l'envoi ici

		res.status(201).json({
			success: true,
			message: "Your message is send. Thank you for participating.",
			data: newContact,
		});
	} catch (error) {
		console.error("Error in Create contact message:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteContact = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid contact message Id" });
	}

	try {
		const contacts = await Contact.findByIdAndDelete(id);

		// si le contact message n'existe pas
		if (!contacts) {
			return res
				.status(404)
				.json({ success: false, message: "Contact message not found" });
		}

		res
			.status(200)
			.json({ success: true, message: "Contact message successfully deleted" });
	} catch (error) {
		console.log("Error in deleting contact message:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
