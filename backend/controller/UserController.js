const fs = require('fs');
const csv = require('csv-parser');
const db = require('../database/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const UserRepository = require("../repository/UserRepository");
const RoleRepository = require("../repository/RoleRepository");
const {ModifiableRole} = require("../constant/AllowedModifiableRoles");
const {isArrayEquals} = require("../utils/array.util");
const {validateEmail} = require("../utils/emailUtils");
const {buildResetPasswordEmail, buildVerificationEmail, sendEmail} = require('../utils/emailUtils');

exports.getUserById = (req, res) => {
    UserRepository.findUserById(req.body.userid).then(result => {
        res.send({userdata: result});
    });
}

exports.updateUserProfile = (req, res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    let profileImg = req.body.profileimg;
    const address = req.body.address;
    const phoneNum = req.body.phonenum;
    const userId = req.body.userid;

    if (profileImg !== null && profileImg !== undefined) {
        console.log(req.body.profileImg)
        profileImg = profileImg.replace(/\\/g, "/");
    }


    UserRepository.updateUserProfile(firstName, lastName, profileImg, address, phoneNum, userId)
        .then((result) => {
            res.send({result: result});
        });
}

exports.registerUser = async (req, res) => {
    const today = new Date();
    const roleId = req.body.roleId;
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today,
    };

    const selectedRole = await RoleRepository.findRoleById(roleId);

    if (selectedRole != null) {
        UserRepository.findUserByEmail(userData.email)
            .then((user) => {
                if (!user) {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        userData.password = hash;
                        UserRepository.createUser(userData)
                            .then((user) => {
                                user.addRole(selectedRole);
                                res.json({status: user.email + ' registered'});
                            }).catch(err => {
                            res.status(500).json(`error: ${err.toString()}`)
                        });
                    });
                } else {
                    res.status(400).json({error: ' User already exists'});
                }
            })
            .catch((err) => {
                res.status(500).send('error: ' + err);
            });
    } else {
        res.status(404).json('error: Role is invalid');
    }

}
process.env.SECRET_KEY = 'secret_fyp';

exports.loginWithRole = (req, res) => {
    UserRepository.findUserByEmail(req.body.email)
        .then((results) => {
            if (results) {
                console.log('user exists');

                if (bcrypt.compareSync(req.body.password, results.password)) {
                    let mydata = JSON.stringify(results);
                    mydata = JSON.parse(mydata);
                    mydata['role'] = req.body.role;
                    console.log(JSON.stringify(mydata));
                    let token = jwt.sign(mydata, process.env.SECRET_KEY);
                    console.log("Correct password");
                    //check role
                    UserRepository.findUserByEmailAndRole(req.body.email, req.body.role)
                        .then((results) => {
                            if (results.length > 0) {
                                res.send({token: token});
                            } else {
                                console.log('Wrong role selected');
                                res.status(400).json({error: 'Wrong role selected'});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(400).json({error: "error is here"});
                        });


                } else {
                    console.log('Wrong password');
                    res.status(400).json({error: 'Wrong password'});
                }
            } else {
                console.log('user does not exist');
                res.status(404).json({error: "User does not exist"})
            }
        })
        .catch((err) => {
            res.status(400).json({error: err.toString()});
        });
}

exports.registerUserByCsv = async (req, res) => {
    const email = req.body.email;
    const role = req.body.role;
    if (req.file) {
        await createUserByCsv(req, res);
        try {
            fs.unlinkSync(path.resolve(__dirname, '..', req.file.path));
        } catch (err) {
            console.log(err);
        }
    } else if (email) {
        await createUser(req, res);
    }
}

exports.completeRegistration = (req, res) => {
    const userId = req.body.userid;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const profileimg = req.body.profileimg;
    const address = req.body.address;
    const phonenum = req.body.phonenum;
    const password = req.body.password;

    const hashPassword = bcrypt.hashSync(password, 10);

    UserRepository.findUserById(userId).then(user => {
        user.first_name = firstName;
        user.last_name = lastName;
        user.profileimg = profileimg;
        user.address = address;
        user.phonenum = phonenum;
        user.password = hashPassword;
        user.active = true;
        user.verification_hash = '';
        return user.save();
    }).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(400).json({message: err});
    })
}

exports.getRegistrationCsv = (req, res) => {
    var csvLink = req.protocol + '://' + req.get('host');

    if (req.query.role === 'teacher') {
        csvLink += '/registration_form/' + 'Teacher-Format.csv';
    } else {
        csvLink += '/registration_form/' + 'Admin-Format.csv';
    }

    res.send(csvLink);
}

exports.getUserByVerificationHash = (req, res) => {
    const hash = req.body.hash;

    UserRepository.findUserByVerificationHash(hash).then(user => {
        const dto = {
            "user": user,
            "role": user.roles[0]
        };
        res.json(dto);
    }).catch(err => {
        res.status(400).json({message: 'User have been registered', error: err.toString()});
    });
}

exports.adminGetAllProfile = (req, res) => {
    UserRepository.findAllModifiableUserByRole(ModifiableRole.ADMIN).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(500).json({error: err.toString()});
    })
}

exports.addUserRole = async (req, res) => {
    const userId = req.body.userId;
    const newRoleId = req.body.roleId;
    const isRoleExisted = RoleRepository.findRoleById(newRoleId);
    const isUserExisted = UserRepository.checkUserExistByEmail(userId);
    if (!isUserExisted) {
        res.status(400).json({error: "User not found"});
    }
    if (!isRoleExisted) {
        res.status(400).json({error: "Role not found"});
    }
    UserRepository.addUserRole(userId, newRoleId).then(result => {
        res.json({message: "success"});
    }).catch(err => {
        res.status(500).json({error: err.toString()});
    })
}

exports.removeUserRole = (req, res) => {
    const userId = req.body.userId;
    const roleId = req.body.roleId;
    const isRoleExisted = RoleRepository.findRoleById(roleId);
    const isUserExisted = UserRepository.checkUserExistByEmail(userId);
    if (!isUserExisted) {
        res.status(400).json({error: "User not found"});
    }
    if (!isRoleExisted) {
        res.status(400).json({error: "Role not found"});
    }
    UserRepository.removeUserRole(userId, roleId).then(result => {
        res.json({message: "success"});
    }).catch(res => {
        res.status(500).json({error: "Role is not deleted"});
    })
}


exports.sendForgetPasswordEmail = (req, res) => {
    const {email, resetPasswordLinkPrefix} = req.body;
    const isUserExisted = UserRepository.checkUserExistByEmail(email);
    if (!isUserExisted) {
        res.status(400).json({error: "User not found"});
    }

    const user = UserRepository.findAllUserByEmail(email);

    if (user.verification_hash != null) {
        res.status(400).json({error: "User has registered. Please refer to your email to activate your account."});
    }

    const hashEmail = bcrypt.hashSync(email, 10).replace('/', '.');
    console.log(resetPasswordLinkPrefix);
    console.log(hashEmail);

    console.log('received email address : ' + email);
    UserRepository.updateUserVerificationHashByEmail(email, hashEmail).then(async result => {
        const resetPasswordLink = resetPasswordLinkPrefix + '?hash=' + hashEmail;
        const {subject, text} = buildResetPasswordEmail(resetPasswordLink);
        await sendEmail(email, subject, text, res);
        res.json({message: "Email sent"});
    }).catch(err => {
        console.log(err.toString);
        res.status(500).json({error: "Error occurred. Please try again later"});
    })

}

exports.resetPassword = async (req, res) => {
    const {email, verificationHash, newPassword} = req.body;
    let isEmailEqual = false;
    try {
        const user = await UserRepository.findUserByVerificationHash(verificationHash);
        isEmailEqual = user.email === email;
    } catch (err) {
        console.log(err.toString());
        res.status(404).json({error: "User does not exist"});
    }
    try {
        if (isEmailEqual) {
            const hashPassword = bcrypt.hashSync(newPassword, 10);
            UserRepository.updatePasswordByEmail(email, hashPassword).then(result => {
                res.json({message: "Password updated successfully"});
            })
        } else {
            res.status(404).json({error: "Unauthorized access"});
        }
    } catch (err) {
        res.status(500).json({error: "Error occurred. Please try again later."})
    }


}

const createUserByCsv = async (req, res) => {
    const file = req.file;
    const allowedRoles = req.body.allowedRoles;
    const registrationLinkPrefix = req.body.registrationLinkPrefix;
    if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'text/csv') {
        const emails = [];
        const rows = {};
        var errMessage = [];
        var rowNum = 1;

        var source = fs.createReadStream(file.path)
            .pipe(csv({skipComments: true}))
            .on('headers', headers => {
                const isCsvFormatCorrect = isArrayEquals(['email', 'role'], headers);
                if (!isCsvFormatCorrect) {
                    res.status(400).json({message: ['The csv is in incorrect format']});
                    source.destroy();
                } else if (allowedRoles === undefined || allowedRoles.length === 0) {
                    res.status(400).json({message: ['Allowed roles are empty']});
                    source.destroy();
                } else if (registrationLinkPrefix === undefined) {
                    res.status(400).json({message: ['registration link prefix not found']});
                    source.destroy();
                }
            })
            .on('data', (row) => {
                if (!validateEmail(row['email'])) {
                    errMessage.push('Invalid email format at line ' + rowNum);
                } else if (emails.includes(row['email'])) {
                    errMessage.push('Duplication of emails at line ' + rowNum);
                } else if (!allowedRoles.includes(row['role'])) {
                    console.log(allowedRoles.toString(), row['role']);
                    errMessage.push('Invalid roles assignment at line ' + rowNum);
                }
                emails.push(row['email']);
                rows[row['email']] = row['role'];
                rowNum += 1;
            })
            .on('end', async () => {
                    const existingUsers = (await UserRepository.findAllUserByEmail(emails));
                    if (existingUsers.length > 0) {
                        for (let i = 0; i < existingUsers.length; i++) {
                            errMessage.push(existingUsers[i].email + ' user existed');
                        }
                    }
                    if (errMessage.length > 0) {
                        res.status(400).json({message: errMessage});
                    } else {
                        var usersData = emails.map(email => {
                            const hashEmail = bcrypt.hashSync(email, 10).replace('/', '.');
                            return {'email': email, 'active': false, verification_hash: hashEmail};
                        });

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
                                const registrationLink = registrationLinkPrefix + '?hash=' + verification_hash;
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
                            return res.status(400).json({error: err.toString});
                        });
                    }
                }
            );
    } else {
        res.json('Wrong document format')
    }
}

const createUser = async (req, res) => {
    const today = new Date();
    const roleId = req.body.role;
    const allowedRoles = req.body.allowedRoles;
    const email = req.body.email;
    const registrationLinkPrefix = req.body.registrationLinkPrefix;

    const role = await RoleRepository.findRoleById(roleId);

    if (allowedRoles.includes(roleId) && role && email) {
        const hashEmail = bcrypt.hashSync(email, 10);
        const userData = {
            email: req.body.email,
            verification_hash: hashEmail.replace('/', '.'),
            status: false,
            created: today,
        };
        UserRepository.findUserByEmail(req.body.email)
            .then((user) => {
                if (!user) {
                    UserRepository.createUser(userData)
                        .then((user) => {
                            user.addRole(role);
                            return user;
                        }).then(async (userResult) => {
                        const verification_hash = userResult.verification_hash;
                        const registrationLink = registrationLinkPrefix + '?hash=' + verification_hash;
                        const {subject, text} = buildVerificationEmail(email, registrationLink);
                        await sendEmail(email, subject, text, res);

                        res.json({status: userResult.email + ' registered'});

                    }).catch(function (err) {
                        console.log(err);
                        return res.status(400).json({message: 'error: ' + err});
                    });
                } else {
                    res.status(400).json({message: ' User already exists'});
                }
            })
            .catch((err) => {
                res.status(400).json({message: 'error: ' + err});
            });
    } else {
        res.status(400).json({message: 'Invalid role assignment'});
    }

}
