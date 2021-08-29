import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Order, OrderStore } from '../models/orders';
import { User } from '../models/user';

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
  const orders = await store.index()
  res.json(orders)
}

const show = async (_req: Request, res: Response) => {
   const order = await store.show(_req.body.id)
   res.json(order)
}

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader?.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token.')
        return 
    }
    try {
        const order: Order = {
            id: req.body.id,
            product_ids: req.body.product_ids,
            product_quantity: req.body.product_quantity,
            user_id: req.body.user_id,
            order_status: req.body.order_status
        }
        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch(err) {
        res.status(400)
        res.json(err)
    }

}

const destroy = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader?.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token.')
        return 
    }
    try {
        const deleted = await store.delete(req.body.id)
        res.json(deleted)
    } catch(err) {
        res.status(400)
        res.json({err})
    }
}

const update = async (req: Request, res: Response) => {
    const user: User = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    }
    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        if(decoded.id !== user.id) {
            throw new Error('User id does not match!')
        }
    } catch(err) {
        res.status(401)
        res.json(err)
        return
    }

    try {
        const updated = await store.create(user)
        res.json(updated)
    } catch(err) {
        res.status(400)
        res.json(err + user)
    }
}

const productRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products:id', show)
    app.post('/products', create)
    app.delete('/products:id', destroy)
    app.post('/products:id', update)

}


export default productRoutes