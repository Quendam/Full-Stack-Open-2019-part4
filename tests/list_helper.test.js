const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', ()=> {

  test('of empty is zero', () =>{
    expect(listHelper.totalLikes([])).toBe(0);
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const listOfBlogs = [
    {
      _id: '1',
      title: 'Blog1',
      author: 'Petri Kataja',
      url: 'http://www.mooc.fi/#blog1',
      likes: 5,
      __v: 0
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Petri Kataja',
      url: 'http://www.mooc.fi/#blog2',
      likes: 15,
      __v: 0
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Petri Kataja',
      url: 'http://www.mooc.fi/#blog3',
      likes: 50,
      __v: 0
    }
  ]

  test('of bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listOfBlogs)
    expect(result).toBe(70)
  })

});