const GenreRepository = require("../repository/GenreRepository");

exports.getAllGenre = (req,res)=>{
    GenreRepository.findAllGenre().then(genres=>{
        res.json(genres);
    });
}

exports.addGenre = (req, res) => {
  const genreName = req.body.newFieldName;
  GenreRepository.createGenre(genreName)
    .then((res) => {
      return res.json('Genre created successfully.');
    })
    .catch((err) => {
      res.status(400).json({ message: 'Failed to create new genre' });
    });
};

exports.deleteGenre = (req, res) => {
  const genreName = req.body.deleteFieldName;
  GenreRepository.deleteGenre(genreName)
    .then((res) => {
      return res.json('Genre deleted successfully.');
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
};