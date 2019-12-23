const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (requet, response) => {
  const users = await User.find({})
  
  response.json(users)
})
  
usersRouter.post('/', async (request, response, next) => {
  
  try{
    const body = request.body

    if(!body.password || body.password.length < 3){
      response.status(400).json({
        error: "Password not given or is too short"
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch(exception) {    
    next(exception)
  }
})

module.exports = usersRouter