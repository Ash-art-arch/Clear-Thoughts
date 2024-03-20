import dotenv from "dotenv"
import { connectDB } from "./db/db.js"
import app from "./app.js"

dotenv.config({
    path: "./.env"
})

connectDB()
.then(() => {
    const port = process.env.PORT || 3000
    app.on("err", (error) => {
        console.log(error)
        throw error
    })
    app.listen(port, () => {
        console.log(`Server is listening on port: ${port}`)
    })
})
.catch((error) => {
    console.log("Error: ", error)
})