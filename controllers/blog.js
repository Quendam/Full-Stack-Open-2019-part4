const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
    .find({})
    .populate('user', {
      name: 1,
      username: 1,
      id: 1
    })
    
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = getTokenFrom(request)

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

  try{    

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(exception){
    next(exception)
  }
})
  
blogsRouter.put('/:id', async (request, response) => {
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

  if(!body.author){
    return response.status(400).json({
      error: 'author is missing'
    })
  }

  if(!body.likes){
    return response.status(400).json({
      error: 'Likes is missing'
    })
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, {new: true})
  
  if(updatedBlog){
    response.json(updatedBlog.toJSON())
  }

  response.status(500).end()  
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)
  // if(result){
    response.status(204).end();
  // }
  // response.status(404).end()
})

module.exports = blogsRouter