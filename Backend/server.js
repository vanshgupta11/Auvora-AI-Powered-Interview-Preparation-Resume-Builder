require("dotenv").config()

// Global error handlers — log everything so Render shows useful crash info
process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
    process.exit(1);
});
const app = require('./src/app')
const connectToDb = require('./src/config/database')


connectToDb()



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is started at port no. ${PORT}`);
})













// to do -  email verification by regix,,, more check is username or email ,, google auth/