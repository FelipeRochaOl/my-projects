const express = require('express')
const server = express()
const port = process.env.port || 3000

server.listen(port, () => console.log(`Server express listening port:${port}`))

server.use(express.json())

let cont = 0
const projects = []

const contRequest = (req, res, next) => {
    console.log(cont += 1)
    next()
}

const validateProjectId = (req, res, next) => {
    const { id } = req.params
    const project = projects.findIndex((elem) => elem.id === id)

    if (project === -1) {
        return res.status(404).json({ message: 'Error, not found project' })
    }

    req.params.index = project
    next()
}

server.get('/projects', contRequest, (req, res) => {
    return res.json({ projects })
})

server.post('/projects', contRequest, (req, res) => {
    const { id, title } = req.body
    projects.push({ id, title, tasks: [] })

    return res.status(201).json({ message: 'Inserted projects' })
})

server.post('/projects/:id/tasks', contRequest, validateProjectId, (req, res) => {
    const { index } = req.params
    const { title } = req.body
    projects[index].tasks.push(title)

    return res.status(201).json({ 
        message: `Inserted task from project ${projects[index].title}` 
    })
})

server.put('/projects/:id', contRequest, validateProjectId,  (req, res) => {
    const { index } = req.params
    const { title } = req.body
    projects[index].title = title

    return res.status(201).json(projects)
})

server.delete('/projects/:id', contRequest, validateProjectId, (req, res) => {
    const { index } = req.params
    projects.splice(index, 1)

    return res.status(200).json({ message: 'Deleted sucess' })
})