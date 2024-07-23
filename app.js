const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    fs.readFile('./public/data/posts.json', 'utf8', (err, data) => {
        try{
            let posts = JSON.parse(data);
            const paginatedPosts = posts.slice(startIndex, endIndex);

            res.render('index', { 
                posts: paginatedPosts,
                currentPage: page,
                totalPages: Math.ceil(posts.length / limit)
             });
        } catch{
            res.status(500).send('Error parsing posts.json');
        }
      
    });
});
/*
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    fs.readFile('./public/data/users.json', 'utf8', (err, usersData) => {
      if (err) {
        res.status(500).send('Error reading users data');
        return;
      }
      const users = JSON.parse(usersData);
      const user = users.find(u => u.id === userId);
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
  
      fs.readFile('./posts.json', 'utf8', (err, postsData) => {
        if (err) {
          res.status(500).send('Error reading posts data');
          return;
        }
        const posts = JSON.parse(postsData);
        const userPosts = posts.filter(post => user.posts.includes(post.id));
        res.render('user', { user, posts: userPosts });
      });
    });
  });
*/
app.get('/users', (req, res) => {
    fs.readFile('./public/data/users.json', 'utf8', (err, usersData) => {
        try{
          const users = JSON.parse(usersData);
            fs.readFile('./public/data/posts.json', 'utf8', (err, postsData) => {
                if (err) {
                    res.status(500).send('Error reading posts data');
                    return;
                }
                const posts = JSON.parse(postsData);
                res.render('users', { users, posts });
          });
        }catch{
            res.status(500).send('Error parsing users.json');
            return;
        }
        
    });
});

app.listen(PORT, () => {
    console.log('server started')
});