'use strict';
const connection = require('../config/database');
const moment = require('moment');
const multer = require('multer');
const request = require('request');

module.exports = function (app) {
    app.post('/search', function (req, res) {
        if (Object.keys(req.body.search).length > 0) {
            let query = req.body.search;
            let options = {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/search/movie',
                qs:
                {
                    include_adult: 'false',
                    page: '1',
                    query: query,
                    language: 'en-US',
                    api_key: '1185e8c25283906b3e9900884f07fa0e'
                },
                body: '{}'
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                res.status(200).send(body);
            });
        }
    });

    app.get('/movies/popular', function (req, res) {
        let options = {
            method: 'GET',
            url: 'https://api.themoviedb.org/3/movie/popular',
            qs:
            {
                page: '1',
                language: 'en-US',
                api_key: '1185e8c25283906b3e9900884f07fa0e'
            },
            body: '{}'
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.status(200).send(body);
        });
    });

    /**
     * Bookmark will be after a list of movies is displayed to the user.
     * Becuse we dont have a API when we can search from TMDB ID we will get the External ID from IMBD ID.
     * @params (user_ID | TMDB_ID)
     */

    app.post('/bookmark', function (req, res) {
        if (Object.keys(req.body).length > 0) {
            let userID = req.body.user_ID;
            let TMDB_ID = req.body.TMDB_ID;
            connection.query('SELECT * FROM user WHERE user_ID = ?', [userID], function (error, result) {
                if (error) throw error;
                if (result.length > 0) {
                    let options = {
                        method: 'GET',
                        url: `https://api.themoviedb.org/3/movie/${TMDB_ID}/external_ids`,
                        qs: { api_key: '1185e8c25283906b3e9900884f07fa0e' },
                        body: '{}'
                    };

                    request(options, function (error, response, body) {
                        if (error) throw new Error(error);
                        if (body) {
                            let resp = JSON.parse(body);
                            var options = {
                                method: 'GET',
                                url: `https://api.themoviedb.org/3/find/${resp.imdb_id}`,
                                qs:
                                {
                                    external_source: 'imdb_id',
                                    language: 'en-US',
                                    api_key: '1185e8c25283906b3e9900884f07fa0e'
                                },
                                body: '{}'
                            };

                            request(options, function (error, response, body2) {
                                if (error) throw new Error(error);
                                let resp2 = JSON.parse(body2);
                                let data = {
                                    user_ID: userID,
                                    tmdb_ID: TMDB_ID,
                                    imdb_ID: resp.imdb_id,
                                    movie_name: resp2.movie_results[0].original_title,
                                    liked: 1
                                }
                                connection.query('INSERT INTO `bookmark` SET ?', data, function (error, result) {
                                    if (error) throw error;
                                    res.status(200).send({ message: 'subscribed' });
                                })
                            });
                        }
                    });
                } else {
                    res.status(202).send({ message: 'User_ID is incorrect' });
                }
            })
        }
    })
}