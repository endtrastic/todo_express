const { rejects } = require('assert')
const express = require('express')
const { read } = require('fs')
const app = express()
const path = require('path')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile =  (filename) => {
    return new Promise((resolve, reject) =>{
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
                return;
            }
            const tasks = data.split("\n")
            path.resolve(tasks)
    });
  })  
}

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

app.get('/', (req, res) => {

    readFile('./tasks')
    .then(tasks => {
        console.log(tasks)
        res.render('index', { tasks: tasks })
    })
  })

app.use(express.urlencoded({ extended: true}));

app.post("/", (req, res) => {

    readFile("./tasks.json")
    .then((tasks) => {
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
        data = JSON.stringify(tasks, null, 2);
        writeFile("tasks.json", data)
        res.redirect('/')
      });
    }) 

app.get("/delete-task/:taskId", (req, res) => {
    let deletedtaskId = parseInt(req.params.taskId);
    readFile("./tasks.json")
    .then((tasks) => {
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
  

app.listen(3001, () => {
    console.log('Starting the server at http://localhost:3001')
}) 