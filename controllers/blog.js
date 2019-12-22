const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    const body = request.body

    if(!body.title){
      return response.status(400).json({
        error: 'Title is missing'
      })
    }

    if(!body.url){
      return response.status(400).json({
        error: 'Url is missing'
      })
    }

    const blog = new Blog(body)

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  module.exports = blogsRouter