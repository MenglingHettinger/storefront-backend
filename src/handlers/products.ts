import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Product, ProductStore } from '../models/product';
import { User } from '../models/user';

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  const products = await store.index()
  res.json(products)
}

const show = async (_req: Request, res: Response) => {
   const product = await store.show(_req.body.id)
   res.json(product)
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
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }
        const newProduct = await store.create(product)
        res.json(newProduct)
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
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }
        const updated = await store.create(product)
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