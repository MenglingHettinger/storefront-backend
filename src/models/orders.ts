// @ts-ignore
import Client from '../database';

export type Order = {
    id: String;
    product_ids: String[];
    product_quantity: Number[];
    user_id: String;
    order_status: String;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            // @ts-ignore
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get orders. Error: ${err}`)
        }


    }
    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const results = await conn.query(sql, [id])
            conn.release()
            return results.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (id, product_ids, product_quantity, user_id, order_status) VALUES ($1, $2, $3, $4, $5) RETURNING *'
            // @ts-ignore
            const conn = Client.connect()
            const result = await conn.query(
                sql, [o.id, o.product_ids, o.product_quantity, o.user_id, o.order_status]
                )
            const product = result.rows[0]
            conn.release()
            return product
        } catch (err) {
            throw new Error(`Could not add new order ${o.id}. Error: ${err}`)

        }
    }
    
    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'
            // @ts-ignore
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            const product = result.rows[0]
            conn.release()
            return product
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`)
        }
    }
}