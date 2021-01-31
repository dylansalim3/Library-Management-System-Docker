
const AuthorRepository = require('../repository/AuthorRepository');

exports.getAllAuthor = (req, res) => {
  AuthorRepository.findAllAuthor().then((authors) => {
    res.json(authors);
  });
};

exports.addAuthor = (req, res) => {
  const authorName = req.body.newFieldName;
  AuthorRepository.createAuthor(authorName)
    .then((res) => {
      return res.json('Author created successfully.');
    })
    .catch((err) => {
      res.status(400).json({ message: 'Failed to create new author' });
    });
};