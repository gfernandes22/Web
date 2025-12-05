import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('cart_id').unsigned().references('id').inTable('carts').onDelete('CASCADE').notNullable()
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.integer('quantity').unsigned().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')


      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}