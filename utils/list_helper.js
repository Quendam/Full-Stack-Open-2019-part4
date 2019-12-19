const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((prev, cur) => prev + cur.likes, 0);

const favoriteBlog = (blogs) => {
  let favorite = {
    likes: -1
  };

  blogs.forEach(current => {
    if(current.likes > favorite.likes) {
      favorite = current
    }
  });

  return favorite.likes == -1 ? {} : favorite;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}