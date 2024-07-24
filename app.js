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
app.get ('/search' , (req,res)=>{
  const query = req.query.search;
  fs.readFile('./public/data/posts.json', 'utf8', (err, data) => {
    try{
        let posts = JSON.parse(data);
        const searchResults = posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase() 
        || post.text.includes(query.toLowerCase())
        || post.tags.includes(query.toLowerCase())));
    
        res.render('index', { 
            posts: searchResults,
            currentPage: 1,
            totalPages: 1
         });
    } catch{
        res.status(500).send('Error parsing posts.json');
    }
})})
app.listen(PORT, () => {
    console.log('server started')
});