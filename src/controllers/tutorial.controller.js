const db = require("../models")
const Tutorial = db.tutorials
const Op = db.Sequelize.Op

// Create and Save a new Tutorial
exports.create = async  (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!"
      })
      return
    }
  
    // Create a Tutorial
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false
    }

    // Save Tutorial in the database
    try {
        const data = await Tutorial.create(tutorial)
        res.send(data)
    } catch (error) {
        console.error('Some error occurred while creating the Tutorial.: ', error)
    }

}

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
    const title = req.query.title
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null
  
    try {
        const data = await Tutorial.findAll({ where: condition })
        res.send(data)
    } catch (error) {
        console.error('Some error occurred while creating the Tutorial.: ', error)
    }

}

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
    const id = req.params.id
          
    try {
        const data = await Tutorial.findByPk(id)
        res.send(data)
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Tutorial with id=" + id
        })
    }

}

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id

    try {
      const data = await Tutorial.update(req.body, {
        where: { id: id }
      })

      if (data == true) {
        res.send({
          message: "Tutorial was updated successfully."
        })
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        })
      }
    } catch (error) {
      res.status(500).send({
        message: `Error updating Tutorial with id= ${id}`
      })
    }

}

// Delete a Tutorial with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id
  
    try {
        const data = await Tutorial.destroy({
            where: { id: id }
        })
 
        if (data == true) {
            res.send({
                message: "Tutorial was deleted successfully!"
            })
        } else {
            res.send({
                message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
            })
        }
        
    } catch (error) {
        res.status(500).send({
            message: `Could not delete Tutorial with id= ${id}`
        })
    }
}

// Delete all Tutorials from the database.
exports.deleteAll = async (req, res) => {


    try {
      const data = Tutorial.destroy({
        where: {},
        truncate: false
      })
      
      if (data == true) {
        res.send({ message: `${data} Tutorials were deleted successfully!` })
      }

    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      })
    }

}

// Find all published Tutorials
exports.findAllPublished = async (req, res) => {

    try {
      const data = await Tutorial.findAll({ where: { published: true } })

      if (data == true) {
        res.send(data)        
      }
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      })
    }

}