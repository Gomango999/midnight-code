const showdown = require('showdown');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const showdownKatex = require('showdown-katex')

// Metadata files for blogs
// Update me when adding new blog posts
files = [
  '00_intro.json',
  '01_memset.json',
  '02_baubles.json',
  '03_food.json',
  '04_hoppers.json',
  '05_primes.json',
  '06_token.json',
  '07_rect.json',
  '08_triangle.json',
]

// Generate blogs list, and populate it with information
let blogs = []
files.forEach(filename => {
  rawText = fs.readFileSync(path.join('./public/files/blog_posts/', filename), 'utf-8');
  blog = JSON.parse(rawText);
  const converter = new showdown.Converter({
    extensions: [showdownKatex({
      delimiters: [{ left: '$', right: '$', asciimath: false }],
    })]
  });
  let rawMarkdown = fs.readFileSync(path.join('./public/files/blog_posts/', blog.name + '.md'), 'utf-8');
  blog.content = converter.makeHtml(rawMarkdown);
  blog.url = '/'+blog.name;
  blog.timeFromUpload = moment(blog.uploadDate).fromNow();
  blogs.push(blog);
});

// Sort blogs in reverse chronological order
blogs.sort((a, b) => {
  return moment(a.uploadDate).isBefore(moment(b.uploadDate)) ? 1 : -1;
});

// Add renderers to each blog
blogs.forEach(blog => {
  blog.renderer = function (req, res) {
    res.render('blog.pug', { blog: blog });
  };
})

exports.blogs = blogs;

exports.index = function (req, res) {
  res.render('blog_list.pug', {
    blogs: blogs,
  });
}
