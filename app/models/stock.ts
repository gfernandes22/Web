import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Product from '#models/products'

export default class Stock extends BaseModel {
  
  public static table = 'stocks'
  
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'product_id' })
  declare productId: number

  @column()
  declare quantity: number

  // Colunas de data e hora
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}