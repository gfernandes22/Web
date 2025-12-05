import type { HttpContext } from '@adonisjs/core/http'
import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Product from '#models/products'

export default class CartsController {

  /**
   * 1. Exibe o carrinho do usuário logado.
   * Carrega os itens do carrinho e os detalhes dos produtos.
   */
  public async index({ auth, view }: HttpContext) {
    // 1. Encontra o carrinho ativo do usuário, ou retorna vazio
    const cart = await Cart.query()
      .where('userId', auth.user!.id)
      .preload('items', (itemQuery) => {
        // 2. Carrega os detalhes do produto E as imagens desse produto
        itemQuery.preload('product', (productQuery) => {
          // ESSENCIAL: Carrega a relação 'images' do Product Model
          productQuery.preload('images')
        })
      })
      .first()

    return view.render('pages/cart/index', { cart })
  }

  // --- Ações do Carrinho ---

  /**
   * 2. Adiciona um produto ao carrinho.
   */
  public async add({ request, response, auth, session }: HttpContext) {
    const { productId, quantity } = request.only(['productId', 'quantity'])

    if (!productId || !quantity || quantity <= 0) {
      session.flash('error', 'Dados inválidos para adicionar o produto.')
      return response.redirect().back()
    }

    // Garante que o produto existe
    const product = await Product.find(productId)
    if (!product) {
      session.flash('error', 'Produto não encontrado.')
      return response.redirect().back()
    }

    // 1. Encontra ou cria o carrinho do usuário
    let cart = await Cart.firstOrCreate(
      { userId: auth.user!.id },
      { userId: auth.user!.id }
    )

    // 2. Tenta encontrar o item no carrinho
    const cartItem = await CartItem.query()
      .where('cartId', cart.id)
      .where('productId', productId)
      .first()

    if (cartItem) {
      // 3a. Se o item já existe, apenas atualiza a quantidade
      cartItem.quantity += quantity
      await cartItem.save()
      session.flash('success', `${product.name} adicionado(s) novamente ao carrinho.`)
    } else {
      // 3b. Se não existe, cria um novo item
      await CartItem.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      })
      session.flash('success', `${product.name} adicionado ao carrinho!`)
    }

    return response.redirect().toRoute('cart.index')
  }

  /**
   * 3. Atualiza a quantidade de um item no carrinho.
   */
  public async update({ request, response, auth, session }: HttpContext) {
    const { itemId, quantity } = request.only(['itemId', 'quantity'])

    if (!itemId || quantity < 0) {
      session.flash('error', 'Dados inválidos para atualização.')
      return response.redirect().back()
    }

    // 1. Encontra o item específico e garante que ele pertence ao carrinho do usuário
    const cart = await Cart.findBy('userId', auth.user!.id)
    if (!cart) {
      session.flash('error', 'Carrinho não encontrado.')
      return response.redirect().back()
    }

    const cartItem = await CartItem.query()
      .where('id', itemId)
      .where('cartId', cart.id)
      .first()

    if (cartItem) {
      if (quantity === 0) {
        // Se a quantidade for 0, remove o item
        await cartItem.delete()
        session.flash('success', 'Item removido do carrinho.')
      } else {
        // Atualiza a quantidade
        cartItem.quantity = quantity
        await cartItem.save()
        session.flash('success', 'Quantidade atualizada.')
      }
    } else {
      session.flash('error', 'Item não encontrado no seu carrinho.')
    }

    return response.redirect().back()
  }

  /**
   * 4. Remove um item do carrinho.
   */
  public async remove({ params, response, auth, session }: HttpContext) {
    const itemId = params.id

    // 1. Encontra o carrinho do usuário
    const cart = await Cart.findBy('userId', auth.user!.id)
    if (!cart) {
      session.flash('error', 'Carrinho não encontrado.')
      return response.redirect().back()
    }

    // 2. Encontra e remove o item, garantindo a posse
    const cartItem = await CartItem.query()
      .where('id', itemId)
      .where('cartId', cart.id)
      .first()

    if (cartItem) {
      await cartItem.delete()
      session.flash('success', 'Produto removido do carrinho.')
    } else {
      session.flash('error', 'Item não encontrado no seu carrinho.')
    }

    return response.redirect().back()
  }
}