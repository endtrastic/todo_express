const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const tasks = JSON.parse(data);
      resolve(tasks);
    });
  });
};

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, "utf-8", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(true);
    });
  });
};

app.get("/", (req, res) => {
  readFile("./tasks.json").then((tasks) => {
    res.render('index',  {tasks: tasks, error: null});
  });
});

app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
    let error = null
    if (req.body.task.trim().length === 0) {
        error = "Task cannot be empty"
        readFile("./tasks.json").then((tasks) => {
        res.render('index',  {tasks: tasks, error: error});
        }) 
    } else {
        readFile("./tasks.json").then((tasks) => {
            let index;
            if (tasks.length === 0) {
              index = 0;
            } else {
              index = tasks[tasks.length - 1].id + 1;
            }
            const newTask = {
              "id": index,
              "task": req.body.task,
            };
            tasks.push(newTask);
            const data = JSON.stringify(tasks, null, 2);
            writeFile("tasks.json", data);
            res.redirect("/");
          });
    } 
});

app.get("/delete-task/:taskId", (req, res) => {
  let deletedtaskId = parseInt(req.params.taskId);
  readFile("./tasks.json").then((tasks) => {
    tasks.forEach((task, index) => {
      if (task.id === deletedtaskId) {
        tasks.splice(index, 1);
      }
    });
    data = JSON.stringify(tasks, null, 2);
    writeFile("tasks.json", data);
    res.redirect("/");
  });
});

app.get("/update-task/:taskId", (req, res) => {
    readFile("./tasks.json").then((tasks) => {
      res.render('update-task',  {task: tasks[parseInt(req.params.taskId)], error: null});
    });
});

app.post("/update-task/:taskId", (req, res) => {
  let error = null
    if (req.body.task.trim().length === 0) {
        error = "Task cannot be empty"
        readFile("./tasks.json").then((tasks) => {
        res.render('update-task',  {task: tasks[parseInt(req.params.taskId)], error: error});
        }) 
    } else {
  readFile("./tasks.json").then((tasks) => {
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(req.params.taskId));
    if (taskIndex !== -1) {
      const taskToUpdate = tasks[taskIndex]; // Add this line
      if (taskToUpdate) { // Add this check
        taskToUpdate.task = req.body.task;
        const data = JSON.stringify(tasks, null, 2);
        writeFile("tasks.json", data);
        res.redirect("/");
      } else {
        res.status(404).send("Task not found");
      }
    } else {
      res.status(404).send("Task not found");
    } 
    });
  };
}) 

app.get("/delete-all-tasks", (req, res) => {
    console.log("delete all tasks")
    readFile("./tasks.json").then((tasks) => {
        tasks.length = 0;
        let data = JSON.stringify([], null, 0);
        writeFile("tasks.json", data);
        res.redirect("/");
      });
  });

app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});