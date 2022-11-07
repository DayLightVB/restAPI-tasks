const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const cars = [
  { id: 1, name: 'car1' },
  { id: 2, name: 'car2' },
  { id: 3, name: 'car3' },
];
app.get('/', (req, res) => {
  res.send('Hello world1');
});

app.get('/api/cars', (req, res) => {
  res.send(cars);
});

// app.get('/api/posts/:year/:month', (req, res) => {
// res.send(req.query) or res.send(req.params);
// });
// http://localhost:5000/api/posts/2001/12 === {"year":"2001", "month":"12"}
// http://localhost:5000/api/posts/2001/12?sortBy=name === {"sortBy":"name"}

// GET
app.get('/api/cars/:id', (req, res) => {
  const car = cars.find((c) => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('The car not found');
  res.send(car); // error 404 :c
});

// POST
app.post('/api/cars', (req, res) => {
  const { error } = validateCar(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const car = {
    id: cars.length + 1,
    name: req.body.name,
  };

  cars.push(car);
  res.send(car);
});

// PUT
app.put('/api/cars/:id', (req, res) => {
  const car = cars.find((c) => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('The car not found');

  const { error } = validateCar(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  car.name = req.body.name;
  res.send(car);
});

function validateCar(req) {
  const schema = Joi.object({
    name: Joi.string().min(3).required,
  });

  return schema.validate(req.body);
}

// DELETE
app.delete('/api/cars/:id', (req, res) => {
  const car = cars.find((c) => c.id === parseInt(req.params.id));
  if (!car) return res.status(404).send('The car not found');

  const index = cars.indexOf(car);
  cars.splice(index, 1);

  res.send(car);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
