export const reqLogger = (req, res, next) => {
	console.log(`${req.method}\t${req.url}`);
	next();
};

//export default reqLogger;
