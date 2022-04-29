
const  mongoose = require('mongoose');

const connect = async () => {
    const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);

    const envUri = process.env.DB_URL;
    const passwordPlaceholder = process.env.DB_PASSWORD_PLACEHOLDER;
    const dbConnectionURI = envUri.split(passwordPlaceholder).join(dbPassword);

    await mongoose.connect(
        dbConnectionURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

    const db = mongoose.connection;
    
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.info("Connected to MongoDB successfully");
    });
}

module.exports = connect;