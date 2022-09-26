import express, { Request, Response } from 'express'
import { User, UserModel } from '../../models/users'
import {validate, userValidationRules} from '../../utils/validate'
import sendEmail from '../../utils/mail'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const server = express.Router()
const usr = new UserModel()
const SECRET = process.env.JWT_SECRET as string
const PEPPER = process.env.PEPPER as string

server.post('/register', userValidationRules(), validate, async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        const user: User = {username, email, password}
        const lookup_mail = await usr.get_user(email)
        const lookup_name = await usr.get_by_name(username)
        if (lookup_mail && lookup_name) {
            return res.status(400).json({message: 'Username and email already in use'})
        } else if (lookup_mail) {
            return res.status(400).json({ error: 'email already in use' })
        } else if (lookup_name) {
            return res.status(400).json({ error: 'username already in use' })
        }
        const newUser = await usr.create(user)
        // send email confirmation
        const token = jwt.sign({
            userId: newUser.id, 
            email: newUser.email
        }, SECRET, {expiresIn: '1d'})
        const url = `http://localhost:8080/auth/confirm/${token}`
        sendEmail(email, "Confirm your email", "Please confirm your email", "Click the button below to confirm your email and gain access to the site. Link expires in 1 day!", url, "Confirm Email")
        return res.redirect('login')
    } catch(err) {
        res.status(500).json(err)
    }
})

server.get('/register', (req: Request, res: Response) => {
    res.render('register', {layout: false})
})

server.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' })
    }
    // const user: User = {email, password}
    try {
        const user = await usr.get_user(email)
        if (!user || !bcrypt.compareSync(password + PEPPER, user.password)) {
            return res.status(401).json({ error: 'Invalid email/password' })
        }

        if (user.status === 'pending') {
            // return res.status(401).json({ error: 'Please verify your email' })
            return res.render('verify_mail', {layout: false})
        }

        // issue JWT
        let token = jwt.sign({
            username: user.username, 
            email: user.email, 
            role: user.role
        }, SECRET, { expiresIn: '15d' })

        // res.json({ token })
        res.redirect('/')
    } catch(err) {
        return res.status(500).json(err)
    }
})

server.get('/login', (req: Request, res: Response) => {
    res.render('login', {layout: false})
})

server.post('/forgot_password', async (req: Request, res: Response) => {
    const email = req.body.email
    if (!email) {
        return res.status(400).json({ error: 'email is required' })
    }
    try {
        // check if user exists in db
        const user = await usr.get_user(email)
        if (!user) {
            return
        } else {
            const token = jwt.sign({
                id: user.id,
                username: user.username, 
                email: user.email, 
                role: user.role
            }, SECRET+user.password, {expiresIn: '15m'})
            const url = `http://localhost:8080/auth/reset_password/${token}`
            // sendEmail(email, url)
            sendEmail(email, "Reset password", "You have requested to reset your password", "A unique link to reset your password has been generated for you. To reset your password, click the following link and follow the instructions.", url, "Reset Password")

            console.log(url);
            res.json({message: 'Reset link sent'})
        }
    } catch(err) {
        return res.status(500).json(err)
    }
})

server.get('/forgot_password', (req: Request, res: Response) => {
    res.render('forgot', {layout: false})
})

server.post('/reset_password/:token', async (req: Request, res: Response) => {
    const { token } = req.params
    const { password, confpassword } = req.body
    if (password !== confpassword) {
        return res.status(400).json({ error: 'password and confirm password don\'t match' })
    }
    if (!token || !password || !confpassword) {
        return res.status(400).json({ error: 'token and password are required' })
    }
    try {
        const obj = jwt.decode(token) as JwtPayload
        // console.log(obj);
        if (!obj) {
            return res.status(400).json({ error: 'Invalid token' })
        }
        const user = await usr.get_user(obj.email)
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        jwt.verify(token, SECRET+user.password, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' })
            }
            const u: User = {id: user.id, email: user.email, password}
            const updatedUser = await usr.update(u)
            // const sql = 'UPDATE users SET password=($1) WHERE email=($2)'
            // const conn = await db.connect()
            // const result = await conn.query(sql, [hash, user.email])
            // const user2 = await usr.get_user(user.email as string)              // as string
            // res.json(user2)
            res.redirect('/auth/login')
        })
        return
        res.json({message: 'Password updated'})
    } catch(err) {
        return res.status(500).json(err)
    }
})

server.get('/reset_password/:token', (req: Request, res: Response) => {
    res.render('reset', {layout: false})
})

server.get('/confirm/:token', async (req: Request, res: Response) => {
    const { token } = req.params
    if (!token) {
        return res.status(400).json({ error: 'token is required' })
    }
    try {
        const obj = jwt.decode(token) as JwtPayload
        if (!obj.email || !obj.userId) {
            // return res.status(400).json({ error: 'Invalid token' })
            return res.render('verify_mail', {layout: false})
        } 
        const user = await usr.get_user(obj.email)
        if (!user) {
            // return res.status(401).json({ error: 'Invalid token' })
            return res.render('verify_mail', {layout: false})
        }
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                // return res.status(401).json({ error: 'Invalid token' })
                return res.render('verify_mail', {layout: false})
            }
            const updatedUser = await usr.update({id: user.id, status: 'active'})
        //     const user2 = await usr.get_user(user.email)
        //     res.json(user2)
            res.redirect('/')
        })
    } catch (err) {
        return res.status(500).json(err)
    }
})



server.post('/signout', async (req: Request, res: Response) => {

})

export default server;