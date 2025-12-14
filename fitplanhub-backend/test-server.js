console.log('TEST: Server file is being executed');

const express = require('express');
const app = express();

console.log('TEST: Express loaded');

app.get('/', (req, res) => {
  res.send('Test works!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`TEST: Server running on port ${PORT}`);
});