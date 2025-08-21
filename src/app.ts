import express from "express";
import Times from "./routes/intervals";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require('./swagger-output.json');

const app = express();

app.use(express.json());

app.use(Times)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`⚡ Server is running at http://localhost:${PORT}`);
});
