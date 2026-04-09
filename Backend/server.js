require("dotenv").config()
const app = require('./src/app')
const connectToDb = require('./src/config/database')


connectToDb()



app.listen(3000, () => {
    console.log("Server is started at port no.3000");
})













// to do -  email verification by regix,,, more check is username or email ,, google auth/