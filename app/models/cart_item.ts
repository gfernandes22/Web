import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Cart from '#models/cart'
import Product from '#models/products'
import User from '#models/users'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // cart_id
  @column()
  declare cartId: number

  // product_id
  @column()
  declare productId: number   

  // user_id
  @column()
  declare userId: number       

  @column()
  declare quantity: number

  @column.dateTime({ columnName: 'created_at', autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ columnName: 'updated_at', autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Cart, { foreignKey: 'cartId' })
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}
