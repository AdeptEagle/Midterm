import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', require('./Midterm/users/user.controller'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
