const express = require('express');
const cors = require('cors');
const app = express();
require('./src/Routes/index')(app);

// const corsOptions = {
//   origin: '*'
// }

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.listen(8001);