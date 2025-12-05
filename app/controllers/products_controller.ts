import type { HttpContext } from '@adonisjs/core/http'
import { createProductValidator } from '#validators/products'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'


import Product from '#models/products'


export default class ProductsController {

  public async index({ view }: HttpContext) {
    const products = await Product.query().preload('images')

    return view.render('pages/products/index', { products })
  }

  public async show({ params, view }: HttpContext) {
    const product = await Product
      .query()
      .where('id', params.id)
      .preload('images')
      .firstOrFail()
      
    return view.render('pages/products/show', { product })
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/products/create')
  }

  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return view.render('pages/products/create', { product })
  }

  public async store({ request, response, session }: HttpContext) {

    const payload = await request.validateUsing(createProductValidator)

    const imageName = `${cuid()}.${payload.image.extname}`

    await payload.image.move(app.makePath('public/uploads/products'), {
      name: imageName,
    })

    const product = await Product.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
    })

    await product.related('images').create({
      name: imageName,
    })

    session.flash('success', 'Produto criado com sucesso!')

    return response.redirect().toRoute('products.index', { id: product.id })
  }

  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = await request.validateUsing(createProductValidator)

    const { image: imageFile, ...productData } = payload


    product.merge(productData)

    if (imageFile) {
      const imageName = `${cuid()}.${imageFile.extname}`

      await imageFile.move(app.makePath('public/uploads/products'), {
        name: imageName,
      })

      const image = await product.related('images').query().first()

      if (image) {
        image.name = imageName
        await image.save()
      } else {

        await product.related('images').create({
          name: imageName,
        })
      }
    }
    await product.save()

    session.flash('success', 'Produto atualizado com sucesso!')
    return response.redirect().toRoute('products.show', { id: product.id })
  }

  public async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.delete()

    return response.redirect().toRoute('products.index')
  }
}