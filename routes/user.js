'use strict';
const connection = require('../config/database');
const moment = require('moment');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bcrypt = require('bcrypt');


module.exports = function (app) {

    /**
    * Content-Type : multipart/form-data
    * @params : name | email | password | image
    * Do not specify content-type multer implicity identifies the content-Type.
    */

    app.post('/registration', upload.single('image'), function (req, res) {
        if (Object.keys(req.file).length == 0 && Object.keys(req.body).length == 0) {
            return res.status(400).send('User image is mandatory.');
        }
        let file = req.file;
        let formData = req.body;
        const saltRounds = 10;
        bcrypt.hash(formData.password, saltRounds).then(function (hash) {
            let data = {
                name: formData.name,
                email: formData.email,
                password: hash,
                image: file.path
            };
            connection.query('INSERT INTO `user` SET ?', data, function (error, results, fields) {
                if (error) throw error;
                connection.query("SELECT * FROM user WHERE user_ID = ?", [results.insertId], function (error, results, fields) {
                    if (error) throw error;
                    let message = {
                        data: results,
                        status: 'Succesfully saved'
                    }
                    res.status(200).send(message);
                });
            });
        });
    });

    /**
     * Content-Type : application/x-www-form-urlencoded
     * @params : username | password
     */

    app.post('/login', function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        if (username && password) {
            connection.query("SELECT * FROM user WHERE email = ?", [username], function (error, results, fields) {
                if (error) throw err;
                if (!results.length <= 0) {
                    bcrypt.compare(password, results[0].password, function (err, check) {
                        if (check == true) {
                            res.status(200).json({ userID: results[0].user_ID });
                        } else if (check == false) {
                            res.status(404).send({ message: "Incorrect password" });
                        }
                    });
                } else {
                    res.status(404).send({ message: "User not found" });
                }
            })
        }
    });

    /**
     * Content-Type : application/x-www-form-urlencoded
     * @params: userID(follower | followee | follow date | unfollow date)
     */
    app.post('/follow', function (req, res) {
        const follower = req.body.follower_ID;
        const followee = req.body.followee_ID;
        if (follower && followee) {
            connection.query("SELECT * FROM user WHERE user_ID = ? OR user_ID = ?", [follower, followee], function (error, result, fields) {
                if (error) throw error;
                if (result.length == 2) {
                    let subscribed_at = moment().format("YYYY-MM-DD HH:MM:SS");
                    let data = {
                        follower_id: follower,
                        followee_id: followee,
                        follow_date: subscribed_at
                    };
                    connection.query('INSERT INTO `follow` SET ?', data, function (error, result, fields) {
                        if (error) throw error;
                        res.status(200).send({ message: "Succesfull" });
                    });
                } else {
                    res.status(404).send({ message: "Incorrect followee id" });
                }
            })
        }
    });

    /**
     * Content-Type : application/x-www-form-urlencoded
     * @params (search : String)
     * Type : GET
     */

    app.get('/usersearch', function (req, res) {
        if (Object.keys(req.query).length !== 0) {
            let search = '%' + req.query.search.replace(/["']/g, "") + '%';
            connection.query("SELECT user_ID, name, email, image from `user` WHERE `name` LIKE ?", search, function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    res.status(200).send(result);
                } else {
                    res.status(200).send({ message: 'No users found' });
                }
            })

        }
    });

    /**
     * Content-Type : application/x-www-form-urlencoded
     * @params (user_ID)
     * Type : POST
     */

    app.post('/profile', function (req, res) {
        if (Object.keys(req.body).length > 0) {
            let user_ID = req.body.userID;
            connection.query('SELECT user_ID, name, email, image from `user` WHERE user_ID = ?', user_ID, function (error, result) {
                connection.query('SELECT COUNT(*) AS followers_count FROM `follow` WHERE followee_id = ?', user_ID, function (error, result2) {
                    connection.query('SELECT COUNT(*) AS following_count FROM `follow` WHERE follower_id = ?', user_ID, function (error, result3) {
                        connection.query('SELECT tmdb_ID as TMDB_ID, movie_name as bookmark, liked FROM `bookmark` WHERE user_ID = ?', user_ID, function (error, result4) {
                            let user = {};
                            user.username = result[0].email;
                            user.name = result[0].name;
                            user.email = result[0].email;
                            user.image = result[0].image;
                            user.followers_count = result2[0].followers_count;
                            user.following_count = result3[0].following_count;
                            user.bookmarks = result4;
                            res.status(200).send(user);
                        })
                    })
                })
            })
        }
    });
}
