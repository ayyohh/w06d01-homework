const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/photo_app")
mongoose.connection.on("connected", () => {
	console.log("connected to data BASS");
});
mongoose.connection.on("error", (err) => {
	console.log("nope not working");
});
mongoose.connection.on("disconnected", () => {
	console.log("we gone");
});
