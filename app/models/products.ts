import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne} from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'   
import Image from '#models/images'     
import CartItem from '#models/cart_item'
import Stock from '#models/stock'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price: number

  @column()
  declare description: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Image)
  public images!: HasMany<typeof Image>

  @hasMany(() => CartItem)
  declare cartItems: HasMany<typeof CartItem>

  @hasOne(() => Stock)
  declare stock: HasOne<typeof Stock>
}