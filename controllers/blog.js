const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments,
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

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

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
    comments: body.comments,
    user: user._id
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, {new: true})
  
  if(updatedBlog){
    response.json(updatedBlog.toJSON())
  }

  response.status(500).end()  
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{    
    const id = request.params.id
    console.log("before delete", request.token);
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(id)
    
    if(blog.user.toString() !== decodedToken.id){
      return response.status(401).json({ 
        error: 'Invalid user. Only blog creator is allowed to remove blog'
      })
    }
    
    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  }catch(exception){
    next(exception)
  }

})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try{    
    const id = request.params.id
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    if(!body.comment){
      return response.status(401).json({
        error: 'comment is missing'
      })
    }

    const blog = await Blog.findById(id)

    blog.comments.push(body.comment)
    
    await Blog.findByIdAndUpdate(request.params.id, blog)
    
    response.status(201).end()
  }catch(exception){
    next(exception)
  }

})

module.exports = blogsRouter