const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
