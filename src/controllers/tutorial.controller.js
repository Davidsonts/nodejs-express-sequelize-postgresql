const db = require("../models");
const Tutorial = db.tutorials;
const { body, validationResult } = require('express-validator');
const { makePaginate } = require("sequelize-cursor-pagination");

// Adiciona o método paginate ao modelo
Tutorial.paginate = makePaginate(Tutorial);
// 1️⃣ Validação + criação
exports.create = [
  // a) Regras de validação
  body('title')
    .notEmpty().withMessage('Título é obrigatório'),
  body('description')
    .isString().withMessage('Descrição deve ser texto')
    .optional({ nullable: true, checkFalsy: true }),

  // b) Middleware que checa erros
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },

  // c) Controlador principal
  async (req, res) => {
    const tutorial = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ?? false
    };
    try {
      const data = await Tutorial.create(tutorial);
      res.status(201).json(data);
    } catch (error) {
      console.error("Erro ao criar Tutorial:", error);
      res.status(500).json({ message: error.message });
    }
  }
];

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
  const { after, before, limit = 10 } = req.query;

  try {
    const page = await Tutorial.paginate({
      where: { published: true },
      limit: Number(limit),
      after,
      before,
      order: [['id', 'ASC']],
    });

    // Extrai os tutoriais dos edges
    const items = page.edges.map(e => e.node);

    res.json({
      data: items,
      totalCount: page.totalCount,
      pageInfo: page.pageInfo,
    });
  } catch (err) {
    console.error("Erro na paginação:", err);
    res.status(500).json({ message: err.message });
  }
};

