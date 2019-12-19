const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((prev, cur) => prev + cur.likes, 0);

const favoriteBlog = (blogs) => {
  let favorite = {
    likes: -1
  }

  blogs.forEach(current => {
    if(current.likes > favorite.likes) {
      favorite = current
    }
  })

  return favorite.likes == -1 ? {} : favorite;
}

const mostBlogs = (blogs) => {
  let bloggers = {}
  let mostBlogs = {
    blogs: -1
  }

  blogs.forEach(current => {
    if(typeof bloggers[current.author] == 'undefined'){
      bloggers[current.author] = {
        author: current.author,
        blogs: 1
      }
    }else{
      bloggers[current.author].blogs++;
    }
  })
  
  Object.values(bloggers).forEach(current => {
    if(current.blogs > mostBlogs.blogs) {
      mostBlogs = current
    }
  })

  return  mostBlogs.blogs == -1 ? {} : mostBlogs
}

const mostLikes = (blogs) => {
  let bloggers = {}
  let mostLikes = {
    likes: -1
  }

  blogs.forEach(current => {
    if(typeof bloggers[current.author] == 'undefined'){
      bloggers[current.author] = {
        author: current.author,
        likes: current.likes
      }
    }else{
      bloggers[current.author].likes += current.likes;
    }
  })
  
  Object.values(bloggers).forEach(current => {
    if(current.likes > mostLikes.likes) {
      mostLikes = current
    }
  })

  return  mostLikes.likes == -1 ? {} : mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}