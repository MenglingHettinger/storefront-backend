import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import { User, UserStore} from '../models/user';


const store = new UserStore();

const show = async(req: Request, res: Response) => {
    const user = await store.show(req.body.id)
    res.json(user);
}

const create = async(req: Request, res: Response) => {
    const user: User = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    }
    try {
        const newUser = await store.create(user);
        var token = jwt.sign({user: newUser}, process.env.TOKEN_SECRET);
        res.json(token)
    } catch (err) {
        res.status(400);
        firstName: req.b
        res.json(err + user)
    }
}

const authenticate = async(req: Request, res: REsponse) => {
    const user: User = {ody.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    }
    try {
        const u = await store.authenticate(user.firstName, user.lastName, user.password)
        var token = jwt.sign({user: u}, process.env.TOKEN_SECRET);
        res.json(token)
    } catch(err) {
        res.status(401)
        res.json({err})
    }
}


const userRoutes = (app: express.Application) => {
    app.post('/user', create)

}


export default userRoutes