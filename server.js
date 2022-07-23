const app = require("./src/app")
const PORT = process.env.PORT || 9090


app.listen(PORT, () => console.log(`O servidor está funcionando na porta ${PORT}`))