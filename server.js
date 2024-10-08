// Full-Stack To-Do List Application

// Backend (server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Replace the connection string to connect to Amazon DocumentDB
mongoose.connect('mongodb://test:12345678@docdb-2024-10-08-21-29-15.cluster-cz4o2wqy0ij3.us-east-2.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', TaskSchema);

app.post('/tasks', async (req, res) => {
  const task = new Task({ title: req.body.title, completed: false });
  await task.save();
  res.send(task);
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

// New route handler for retrieving tasks by user input (search by title)
app.get('/tasks/search', async (req, res) => {
  const searchTitle = req.query.title;
  if (!searchTitle) {
    return res.status(400).send({ message: 'Title query parameter is required' });
  }
  const tasks = await Task.find({ title: new RegExp(searchTitle, 'i') });
  res.send(tasks);
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
