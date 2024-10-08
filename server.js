// Full-Stack To-Do List Application

// Backend (server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todolist', {
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

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});