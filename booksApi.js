const path = require('path')
const fs = require('fs')

const { authenticate } = require('./authenticate')

const booksDbPath = path.join(__dirname, 'db', 'books.json')
// console.log(booksDB)

const getAllBooks = function(req,res){

    fs.readFile(booksDbPath, 'utf8', (err, books)=>{
        if(err){
            res.writeHead(400)
            res.end(`Error occured while getting books`)
        }
        res.end(books)
    })
    
}

const addBook = function(req,res){
    const body = []
    req.on('data', chunks =>{
        body.push(chunks)
    })
    req.on('end', ()=>{
        const parsedBody = Buffer.concat(body).toString()
        // console.log(parsedBody)
        const newBook = JSON.parse(parsedBody)
        // console.log(newBook)
        fs.readFile(booksDbPath, 'utf8', (err,books)=>{
        if(err){
            res.writeHead(400)
            res.end(`An error occured ${err}`)
        }
        const oldBooks = JSON.parse(books)
        const allBooks = [...oldBooks, newBook]
        // console.log(allBooks)
        // update id
        const lastBook = oldBooks[oldBooks.length - 1]
        const lastBookId = lastBook.id;
        const newBookId = lastBookId + 1;
        newBook.id = newBookId;

        fs.writeFile(booksDbPath, JSON.stringify(allBooks), (err)=>{
            if(err){
                res.writeHead(500)
                res.end(JSON.stringify({
                    message: 'Internal Server Error. Could not save book to db'
                }))
            }
            res.writeHead(200)
            res.end(JSON.stringify({
                message: `${newBook.title} added successfully`
           
            }))
        })
    })

    })

}

const updateBook = function(req,res){
    const body = []
    req.on('data', chunk =>{
        body.push(chunk)
    })
    req.on('end', ()=>{
        const parsedBody = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBody)
        const detailsToUpdateId = detailsToUpdate.id

        fs.readFile(booksDbPath, 'utf8', (err,data)=>{
            if(err){
                res.writeHead(400)
                res.end(JSON.stringify({
                    message: 'Error reading file'
                }))
            }
            const books = JSON.parse(data)
            // find book with id
            const bookIndex = books.findIndex(books => books.id === detailsToUpdateId)
            
            if(bookIndex === -1){
                res.writeHead(404)
                res.end('Book not found')
            }

            const updatedBook = {...books[bookIndex],...detailsToUpdate}
            books[bookIndex] = updatedBook;

            fs.writeFile(booksDbPath, JSON.stringify(books), err =>{
                if(err){
                    res.writeHead(500)
                    res.end(JSON.stringify({
                        message: 'Error: internal server err'
                    }))
                }
                res.end('Update successful')
            })
        })
    })
}

const deleteBook = function(req,res){
    const body = []
    req.on('data', (chunk)=>{
        body.push(chunk)
    })
    req.on('end', ()=>{
        const parsedBody = Buffer.concat(body).toString()
        const detailsToUpdate = JSON.parse(parsedBody)
        const detailsToUpdateId = detailsToUpdate.id

        fs.readFile(booksDbPath, 'utf8', (err, data)=>{
            if(err){
                res.writeHead(500)
                res.end(JSON.stringify({
                    message: 'Internal server error'
                }))
            }

            const books = JSON.parse(data)
            
            const bookIndex = books.findIndex(books => books.id === detailsToUpdateId)

            if(bookIndex === -1){
                res.writeHead(404)
                res.end(JSON.stringify({
                    message: 'Index of specified book not found'
                }))
            }

            // Delete functionality/delete method
            books.splice(bookIndex, 1)

            // console.log(books)
            fs.writeFile(booksDbPath, JSON.stringify(books), err =>{
                if(err){
                    res.writeHead(500)
                    res.end(JSON.stringify({
                    message: 'Internal server error'
                    }))
                }
                res.writeHead(200)
                res.end('Deletion successful')
            })
        })

    })
}

// const loanBook = function(req,res){
//     console.log('loan out a book')
// }

// const returnBook = function(req,res){
//     console.log('return borrowed books')
// }




module.exports = {
    getAllBooks,
    addBook,
    deleteBook,
    // loanBook,
    // returnBook,
    updateBook
}