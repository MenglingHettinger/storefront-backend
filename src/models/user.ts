import Client from '../database'
import bcrypt from 'bcrypt'

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserStore {
  async index(): Promise<User[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect()
      const sql = 'SELECT * FROM users'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Unable get users: ${err}`)
    } 
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)'
      //@ts-ignoreX$
      const conn = await Client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`unable show user ${id}: ${err}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'

      const hash = bcrypt.hashSync(
        u.password + pepper, 
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [u.firstName, u.lastName, hash])
      const user = result.rows[0]

      conn.release()

      return user
    } catch(err) {
      throw new Error(`unable create user (${u.firstName} ${u.lastName}): ${err}`)
    } 
  }

  async delete(id: string): Promise<User> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = 'DELETE FROM users WHERE id=($1)'
      
      const result = await conn.query(sql, [id])

      const product = result.rows[0]

      conn.release()

      return product
    } catch(err) {
      throw new Error(`unable delete user (${id}): ${err}`)
    }
  }

  async authenticate(firstName: string, lastName: string, password: string): Promise<User | null> {
    const conn = await Client.connect()
    const sql = 'SELECT password FROM users WHERE firstName=($1) and lastName=($2)'

    const result = await conn.query(sql, [firstName, lastName])

    console.log(password+pepper)

    if(result.rows.length) {

      const user = result.rows[0]

      console.log(user)
      
      if (bcrypt.compareSync(password+pepper, user.password)) {
        return user
      }
    }

    return null
  }
}
