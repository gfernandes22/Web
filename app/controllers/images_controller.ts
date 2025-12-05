import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import Image from '#models/images' // Certifique-se de que o Model está importado

export default class ImagesController {
  public async show({ params, response }: HttpContext) {
    
    // 1. Busca o registro da imagem no banco de dados
    const image = await Image.query().where('name', params.name).first() 

    if (image) {
      // 2. CORREÇÃO: Define o caminho ABSOLUTO para onde o arquivo está salvo.
      // O nome do arquivo (params.name) é adicionado ao diretório base.
      const imagePath = app.makePath('public/uploads/products', params.name)
      
      // 3. Serve o arquivo para o navegador
      return response.download(imagePath)
    }

    // Se o registro não existir ou o arquivo não for encontrado
    return response.status(404)
  }
}