const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Temos aqui o nosso banco de dados conectado :)");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connect
}
