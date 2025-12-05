import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/products'
import Stock from '#models/stock'

export default class StocksController {

  public async create({ params, view, response, session }: HttpContext) {
    try {
      const product = await Product.query()
        .where('id', params.id)
        .preload('stock') 
        .firstOrFail()

      return view.render('pages/stock/create', { product })

    } catch (error) {
      session.flash('error', 'Produto não encontrado para ajuste de estoque.')
      return response.redirect().toRoute('products.index')
    }
  }

  public async update({ params, request, response, session }: HttpContext) {
    const productId = params.id
    
    const { amount: amountInput, type } = request.only(['amount', 'type'])
    const amount = parseInt(amountInput)

    if (isNaN(amount) || amount <= 0 || !['add', 'remove'].includes(type)) {
      session.flash('error', 'Dados de ajuste de estoque inválidos.')
      return response.redirect().back()
    }
    
    let stock = await Stock.firstOrCreate({ productId: productId },{ productId: productId, quantity: 0 })

    if (type === 'add') {
      stock.quantity += amount
      session.flash('success', `${amount} unidade(s) adicionada(s) ao estoque. Estoque atual: ${stock.quantity}.`)
      
    } else if (type === 'remove') {
      if (stock.quantity < amount) {
        session.flash('error', `Estoque insuficiente. Disponível: ${stock.quantity}.`)
        return response.redirect().back()
      }
      stock.quantity -= amount
      session.flash('success', `${amount} unidade(s) removida(s) do estoque. Estoque atual: ${stock.quantity}.`)
    }
    
    await stock.save()
    
    return response.redirect().toRoute('products.index') 
  }
}