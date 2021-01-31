const BookCategoryRepository = require('../repository/BookCategoryRepository');

exports.getAllCategory = (req, res) => {
  BookCategoryRepository.findAllCategory().then((category) => {
    res.json(category);
  });
};

exports.addCategory = (req, res) => {
  const categoryName = req.body.newFieldName;
  BookCategoryRepository.createCategory(categoryName)
    .then((res) => {
      return res.json('Category created successfully.');
    })
    .catch((err) => {
      res.status(400).json({ message: 'Failed to create new category' });
    });
};


exports.deleteCategory = (req, res) => {
  const categoryName = req.body.deleteFieldName;
  BookCategoryRepository.deleteCategory(categoryName)
    .then((res) => {
      return res.json('Category deleted successfully.');
    })
    .catch((err) => {
      res.status(400).json({ message: 'Failed to delete category' });
    });
};
