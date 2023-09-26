const mongoose = require("mongoose");

exports.connectDB = () => {
    const databaseUri = process.env.DATABASE_URI;

    try {
        mongoose.connect(databaseUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log('Successfully connected to MongoDB database');
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
    return;
}