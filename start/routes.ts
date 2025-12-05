/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'



const ImagesController = () => import('#controllers/images_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async ({ view }) => {
  return view.render('home')
}).as('home')

router.get('/register', [UsersController, 'create']).as('users.create')
router.post('/register', [UsersController, 'store']).as('users.store')


router.get('/login', [AuthController, 'showLogin']).as('auth.login')
router.post('/login', [AuthController, 'store']).as('auth.storeLogin')
router.post('/logout', [AuthController, 'logout']).as('auth.logout')

router.get('/products', [ProductsController, 'index']).as('products.index')

router.group(() => {

  router.get('products/:id/stock/adjust', [() => import('#controllers/stock_controller'), 'create']).as('stocks.create')
  router.post('products/:id/stock/adjust', [() => import('#controllers/stock_controller'), 'update']).as('stocks.update')

  router.get('/carrinho', [() => import('#controllers/cart_controller'), 'index']).as('cart.index')
  router.post('/carrinho/adicionar', [() => import('#controllers/cart_controller'), 'add']).as('cart.add')
  router.post('/carrinho/atualizar', [() => import('#controllers/cart_controller'), 'update']).as('cart.update')
  router.post('/carrinho/remover/:id', [() => import('#controllers/cart_controller'), 'remove']).as('cart.remove')

  router.get('/products/create', [ProductsController, 'create']).as('products.create')
  router.post('/products', [ProductsController, 'store']).as('products.store')
  router.get('/products/:id/edit', [ProductsController, 'edit']).as('products.edit')
  router.patch('/products/:id', [ProductsController, 'update']).as('products.update')
  router.delete('/products/:id', [ProductsController, 'destroy']).as('products.destroy')

  router.get('/images/:name', [ImagesController, 'show']).as('images.show') 

  router.get('/profile', [UsersController, 'show']).as('show.profile')
  
  router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')

  router.patch('/users/:id', [UsersController, 'update']).as('users.update')
  router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

}).use(middleware.auth())

router.get('/products/:id', [ProductsController, 'show']).as('products.show')

