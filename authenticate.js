const fs = require('fs')
// const { resolve } = require('path')
const path = require('path')

// require(dotenv).config()

const usersDbPath = path.join(__dirname, 'db', 'users.json')

// read from db
const getAllUsers = function(req,res){
    return new Promise ((resolve,reject) => {
        fs.readFile(usersDbPath, 'utf8', (err,users) => {
            if(err){
                reject('Error hahaha')
            }
            resolve(JSON.parse(users))
        })
    })
}

const authenticate = function(req,res){
    return new Promise((resolve,reject) => {
        const body = []
        req.on('data', chunk =>{
            body.push(chunk)
        })
        req.on('end', async ()=>{
            const parsedBody = Buffer.concat(body).toString()
            if(!parsedBody){
                reject('No username or password provided')
            }
            const loginDetails = JSON.parse(parsedBody)

            const users = await getAllUsers()

            // console.log(users)

            const userFound = users.find((user) => {
                return user.username === loginDetails.username
            })

            if (!userFound){
                reject('User not found. Please sign up!')
            }

            if(userFound.password !== loginDetails.password){
                reject('Invalid username or password!')
            }

            resolve()
        })
    })
}

//  TOKEN AUTHORIZATION
require('dotenv').config()
const TOKEN = process.env.APIKEY

const tokenAuth = function(req,res){
    return new Promise((resolve, reject)=>{
        let token = req.headers.authorization

        if(!token){
            reject('No token found')
        }

        token.split(' ')[1]

        if(token !== TOKEN){
            reject('Invalid token')
        }

        resolve()
    })
}


// Access control authentication
const accessControl = function(req,res,roles){
    return new Promise((resolve, reject) => {
        const body = []
        req.on('data', chunk => {
            body.push(chunk)
        })
        req.on('end', async ()=> {
            const parsedBody = Buffer.concat(body).toString()

            if(!parsedBody){
                reject('Please enter your username and password')
            }

            const { user: loginDetails, book } = JSON.parse(parsedBody)

            const users = await getAllUsers()

            const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password)

            if(!userFound){
                reject('Username or password incorrect')
            }

            if(!roles.includes(userFound.role)){
                reject('You do not have the required role to access this resource')
            }

            resolve(book)

        })
    })
}

module.exports = {
    authenticate,
    tokenAuth,
    accessControl
}