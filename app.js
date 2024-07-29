const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

33
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
                numberOfPosts: posts.length,
                posts: paginatedPosts,
                currentPage: page,
                totalPages: Math.ceil(posts.length / limit),
                messages: null 
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
                res.render('users', { users, posts , message: null});
          });
        }catch{
            res.status(500).send('Error parsing users.json');
            return;
        }
        
    });
});

app.get('/search', (req, res) => {
    const query = req.query.search;
    fs.readFile('./public/data/posts.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts data');
            return;
        }
        try {
            let posts = JSON.parse(data);
            const searchResults = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.text.toLowerCase().includes(query.toLowerCase()) ||
                (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
            );

            const message = searchResults.length === 0 ? 'No results found' : null;

            res.render('index', { 
                numberOfPosts: searchResults.length,
                posts: searchResults,
                currentPage: 1,
                totalPages: 1,
                messages: message // Pass the message variable to the template
            });
        } catch (err) {
            res.status(500).send('Error parsing posts.json');
        }
    });
});

app.get('/search-users', (req,res)=>{
    const query = req.query.search;
    fs.readFile('./public/data/users.json', 'utf8', (err, data) => {
        try{
            let users= JSON.parse(data);
            const searchResults= users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()))
          //  console.log(searchResults)
        const message = searchResults.length === 0 ? 'No results found' : null;
        res.render('users', { 
            users: searchResults,
            message: message // Pass the message variable to the template
        });
    }
        catch (err){
           // console.log(err)
            res.status(500).send('Error parsing users.json in search');
        }

});
})

app.listen(PORT, () => {
    console.log('server started')
});