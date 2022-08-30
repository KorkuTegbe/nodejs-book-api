const http = require('http')
const { getAllUsers,createUser, authenticateUser } = require('./handler_functions')
const { getAllBooks, addBook, deleteBook,loanBook,returnBook,updateBook} = require('./booksApi')
const { authenticate, tokenAuth, accessControl } = require('./authenticate')

const PORT = 4000
const HOSTNAME = 'localhost'

// request handler function
const requestHandler = function(req,res){
    // console.log(req.url)
    res.setHeader('Content-Type','application/json')
    //Users api
    if(req.url === '/users' && req.method === 'GET'){
        // get all users
        // authenticateUser(req,re s)
        authenticate(req,res)
         .then(()=>{getAllUsers(req,res)})
            .catch((err)=>{
                res.writeHead(404)
                res.end(JSON.stringify({
                    message: err 
                }))
            })
        
    }else if(req.url === '/users' && req.method === 'POST'){
        // create user
        createUser(req,res)
    }else if(req.url === '/users' && req.method === 'POST'){
        // authenticate user
    }
    // else{
    //     res.writeHead(400)
    //     res.end(JSON.stringify({
    //         message: 'Bad request'
    //     }))
    // } 

    // books api
    if(req.url === '/books' && req.method === 'GET'){
        // get all books
        tokenAuth(req,res)
          .then(()=>{getAllBooks(req,res)})
            .catch(err => {
                res.writeHead(404)
                res.end(JSON.stringify({
                    message: err
                }))
            })   
               
    }else if(req.url === '/books/addBook' && req.method === 'POST'){
        // create or add book
        accessControl(req,res,['admin','reader'])
          .then(()=>{ addBook(req,res) })
            .catch(err => {
                res.writeHead(404)
                res.end(JSON.stringify({
                    message: err
                }))
            })
    }else if(req.url === '/books/deleteBook' && req.method === 'DELETE'){
        // delete book
        deleteBook(req,res)
    }else if(req.url === '/books/loanBook' && req.method === 'POST'){
        // loan out book
        loanBook(req,res)
    }else if(req.url === '/books/returnBook' && req.method === 'POST'){
        // return book
        returnBook(req,res)
    }else if(req.url === '/books/updateBook' && req.method === 'PUT'){
        // update book details
        updateBook(req,res)
    }else {
        // default 
        res.writeHead(400)
        res.end(JSON.stringify({
            message: 'Bad request'
        }))
    }
}

// create server
const server = http.createServer(requestHandler)

//start server
server.listen(PORT,HOSTNAME, ()=>{
    console.log(`Server started on http://${HOSTNAME}:${PORT}`)
})
