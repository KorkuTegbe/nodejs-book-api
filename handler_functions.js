const path = require('path')
const fs = require('fs')
// const { constants } = require('buffer')
// const { get } = require('http')

const usersDB = path.join(__dirname, 'db', 'users.json')
const booksDB = path.join(__dirname, 'db', 'books.json')

const getAllUsers = function(req,res){
    res.writeHead(200)
    // get file and read
    fs.readFile(usersDB,  (err,users)=>{
        if(err){
            res.writeHead(400)
            res.end(JSON.stringify(
                message, `Error getting users}`
            ))
        }
        res.end(users)
    })
}


const createUser = function(req,res){
    let body = []
    req.on('data', chunk =>{
        body.push(chunk)

        req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString()
            // console.log(parsedBody)
            const newUserToBeAdded = JSON.parse(parsedBody)

            // read file
            fs.readFile(usersDB,'utf8',(err,data)=>{
                if(err){
                    res.writeHead(400)
                    res.end(JSON.stringify(
                        message, `Error ${err}`
                    ))
                }
                const oldUsers = JSON.parse(data);
                const allUsers = [...oldUsers,newUserToBeAdded] //oldUsers.push(newUserToBeAdded)
                // const allUsers = oldUsers.push(newUserToBeAdded)
                res.end('User added successfully')

                // write to file
                fs.writeFile(usersDB, JSON.stringify(allUsers), (err)=>{
                if(err){
                    res.writeHead(500)
                    res.end(JSON.stringify(
                        message, `Internal Server error. could not save to database`
                    ))
                }
                res.end('User added successfully')
                    })
                })

        })
    })
}

module.exports = {
    getAllUsers,
    createUser
}