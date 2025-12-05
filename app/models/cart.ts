import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'   

import User from '#models/users'
import CartItem from '#models/cart_item'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Chave estrangeira para o usuário proprietário do carrinho
  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // RELAÇÕES

  // 1. Um carrinho pertence a um único usuário
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // 2. Um carrinho tem vários itens (CartItem)
  @hasMany(() => CartItem)
  declare items: HasMany<typeof CartItem>
}