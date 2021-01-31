const {Sequelize} = require('../database/db.js');
const BookDetail = require('../models/BookDetail');
const Genre = require('../models/Genre');
const Book = require('../models/Book');
const Author = require('./../models/Author');
const Category = require('./../models/Category');
const db = require('../database/db.js');

exports.getBookDetails = async (searchCriteria, searchCriteriaType, genreId) => {
    const a = {};
    if (genreId) {
        a['genre_id'] = genreId;
    }
    if (searchCriteria) {
        a[searchCriteriaType] = {[Sequelize.Op.like]: `%${searchCriteria}%`};
    }

    return BookDetail.findAll({
        include: [Genre, Book, Category,{model: Author, as: 'authors', attributes: ['name']}],
        where: (Sequelize.fn('lower', Sequelize.col(searchCriteriaType)), a)
    }).map(book => {
        return book;
    });
}

exports.getThreeLatestBook = () => {
    return BookDetail.findAll({
        include: [Genre,Category, Book, Author],
        limit: 3,
        order: [['created', 'DESC']]
    }).map(book => {
        if (book.authors.length > 0) {
            book['author'] = book.authors[0].name;
        }
        return book;
    });
}

exports.findBookDetailById = (bookDetailId, arguments) => {
    return BookDetail.findOne({where: {id: bookDetailId}}, arguments);
}

exports.deleteBookDetailById = (bookDetailId, arguments) => {
    return BookDetail.destroy({where: {id: bookDetailId}}, arguments)
}

exports.findOrCreateBookDetail = (bookDetailEntry, arguments) => {
    return BookDetail.findOrCreate({where: bookDetailEntry, ...arguments});
}

exports.updateBarcodePath = (id,path)=>{
        return db.sequelize.query(
          `UPDATE book_detail SET barcode_path = ${JSON.stringify(path)}
          WHERE book_detail.id =${JSON.stringify(id)}
          `
        );
}

