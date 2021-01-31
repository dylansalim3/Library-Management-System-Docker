# Sequelize Basics

## Create New Table 
### Sample Code
<pre><code>
const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'author',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: Sequelize.STRING,
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    }
);
</code></pre>

## Create Association
### One to One
<pre><code>
bookDetail.hasOne(category);
category.belongsTo(bookDetail);
</code></pre>

### One to Many
<pre><code>
borrowBook.belongsTo(user,{foreignKey: 'user_id',});
user.hasMany(borrowBook,{foreignKey: 'user_id',});
</code></pre>

### Many to Many
<pre><code>
bookDetail.belongsToMany(author,{through: "book_author",foreignKey:'book_detail_id'});
author.belongsToMany(bookDetail, {through: "book_author",foreign_key:'author_id'});
</code></pre>

Force rewrite the db with new structure <b>(WILL TRUNCATE ALL DB TABLE AND RECREATE THEM)</b>
<pre><code>
db.sequelize.sync({force:true});
</code></pre>

## Query
### Select One
<pre><code>
Author.findOne(({where: {name: name}}))
</code></pre>

### Select All
<pre><code>
Author.findAll(({where: {name: name}}))
</code></pre>

### Create
<pre><code>
Author.create(authorData)
</code></pre>

### Find Or Create
<pre><code>
Author.findOrCreate(authorData)
</code></pre>

### Update
<pre><code>
BookDetailRepository.findBookDetailById(bookDetailId, {transaction: t}).then(bookDetail => {
                bookDetail.title = req.body.title;
                bookDetail.isbn = req.body.isbn;
                bookDetail.genre_id = req.body.genreId;
                bookDetail.bookimg = req.body.bookimg;
                bookDetail.summary = req.body.summary;
                bookDetail.datepublished = req.body.datepublished;
                bookDetail.publisher = req.body.publisher;
                bookDetail.location = req.body.location;
                bookDetail.addAuthor(author);
                bookDetail.save();
                return bookDetail;
            });
</code></pre>

### Delete
<pre><code>
BookDetail.destroy({where: {id: bookDetailId}}, arguments);
</code></pre>

### Count
<pre><code>
BorrowBook.count({user_id: userId});
</code></pre>

### Additional Arguments commonly used
#### Include
Include keyword is used when we want to join the association class.
<pre><code>
BookDetail.findAll({
        include: [Genre, Book, {model: Author, as: 'authors', attributes: ['name']}],
        where: (Sequelize.fn('lower', Sequelize.col(searchCriteriaType)), a)
    });
</code></pre>

#### Transaction
Transaction is used when we want to commit or rollback transaction manually.
<pre><code>
const t = await db.sequelize.transaction();
                        const promises = [];
                        for (let i = 0; i < usersData.length; i++) {
                            promises[i] = UserRepository.createUser(usersData[i], {transaction: t});
                        }
                        Promise.all(promises).then(users => {
                            const userRolePromises = [];
                            for (let i = 0; i < users.length; i++) {
                                userRolePromises.push(RoleRepository.findRoleById(rows[users[i].email]).then(role => {
                                    users[i].addRole(role);
                                    return users[i];
                                }));
                            }
                            return Promise.all(userRolePromises);
                        }).then(function (users) {
                            let emailPromises = [];

                            users.forEach(user => {
                                const email = user.email;
                                const verification_hash = user.verification_hash;
                                const registrationLink = registrationLinkPrefix + '/' + verification_hash;
                                const {subject, text} = buildVerificationEmail(email, registrationLink);
                                emailPromises.push(sendEmail(email, subject, text, res));
                            });

                            return Promise.all(emailPromises);
                        }).then((result) => {
                            t.commit();
                            res.send(result);
                        }).catch(function (err) {
                            t.rollback();
                            console.log(err);
                            // t.rollback();
                            return res.status(400).json({error: err.toString});
                            // res.status(400).json({ message: errMessage });
                        });
</code></pre>