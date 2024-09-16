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

app.get('/', (req, res) => {

    readFile('./tasks')
    .then(tasks => {
        console.log(tasks)
        res.render('index', { tasks: tasks })
    })
  })

app.use(express.urlencoded({ extended: true}));

app.post('/', (req, res) => {
    readFile('/tasks')
      .then(tasks => {
        tasks.push(req.body.task)
        const data = tasks.join("\n")
        fs.writeFile('./tasks', data, (err) => {
            if (err) {
                console.error(err)
                return;
            }
            res.redirect('/')
      })
    })
})

app.listen(3001, () => {
    console.log('Starting the server at http://localhost:3001')
}) 