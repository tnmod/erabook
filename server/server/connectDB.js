const mongoose = require('mongoose');
require('../components/products/ProductModel');
require('../components/users/UserModel');
const url = "mongodb+srv://tnmod2003:01285740786Tin@atlascluster.atjjipv.mongodb.net/erabook?retryWrites=true&w=majority";



const connect = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");


        // Sau khi hoàn thành, đóng kết nối
        // await mongoose.disconnect();
        // console.log("Disconnected from MongoDB Atlas!");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
}


module.exports = {
    connect
}