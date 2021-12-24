const express = require('express');
const router = express.Router();
const { default: axios } = require('axios');
const Post = require('../models/Post');

const axios2 = axios.create({
  baseURL: process.env.DOMAIN_APP,
});

/* GET home page. */
router.all('/', async function(req, res, next) {
      const data = req.method === 'POST' ? req.body : req.query;
      const { scope_axios, scope_mongoose, res_type, res_status, req_method } = data;

      const axiosScope = new Set(Array.isArray(scope_axios) ? scope_axios : scope_axios ? [scope_axios] : []);

      if (axiosScope.has('error_conn')) await axios.get('/ajax');
      if (axiosScope.has('error_unhandled')) await axios2.get('/ajax/not-found');

      try {
        if (axiosScope.has('error_handled')) await axios2.get('/ajax/not-found');
      } catch (e) {
      }

      if (axiosScope.has('GET')) await axios2.get('/ajax');
      if (axiosScope.has('POST')) await axios2.post('/ajax');
      if (axiosScope.has('PUT')) await axios2.put('/ajax');
      if (axiosScope.has('PATCH')) await axios2.patch('/ajax');
      if (axiosScope.has('DELETE')) await axios2.delete('/ajax');

      const mongooseScope = new Set(Array.isArray(scope_mongoose) ? scope_mongoose : scope_mongoose ? [scope_mongoose] : []);

      if (mongooseScope.has('error_unhandled')) await Post.aggregate([{$foo: {s: 1} }]);

      try {
        if (mongooseScope.has('error_handled')) await Post.aggregate([]);
      } catch (e) {
      }

      if (mongooseScope.has('fetch')) await Post.aggregate([{ $match: {} }]);

      const status = res_status && res_status.match(/^[1|2|3|4|5|6]\d\d$/) ? res_status : 200;
  
      if (res_type == 'json') {
        return res.status(status).json({ 
          message: 'test json call. check in the response headers, you shoud find "X-Profiler-Link" header with the profiler url' 
        });
      }

      req.app.locals.testScopes = req.app.locals.testScopes.map(scope => {
        return {
          ...scope,
          options: scope.options.map(option => {
            return {
              ...option,
              checked: scope.name === 'axios' ? axiosScope.has(option.value) : mongooseScope.has(option.value),
            }
          })
        }
      })

      return res.status(status).render('index', {
        reqMethod: req_method || 'POST',
        resType: res_type || 'html',
        resStatus: res_status || 200
      });
  });

router.get('/error-unhandled', async function(req, res, next) {
  app.locals;
  return res.status(200).render('index');
});

router.get('/error-handled', async function(req, res, next) {
  try {
    app.locals;
    return res.status(200).render('index');
  } catch (e) {
    next(e);
  }
});

router.all('/ajax', function(req, res, next) {
  let status = '200';

  switch (req.method) {
    case 'POST':
      status = '201';
      break;
  }

  res.status(status).json({ message: 'test ajax' });
});

module.exports = {
  router, 
  axios2
};
