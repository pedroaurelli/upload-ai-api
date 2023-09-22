import { FastifyInstance } from 'fastify'
import { getAllPromptsService } from '../services/prompts/get-all-prompts-service'

export async function promptsController(app: FastifyInstance) {
  app.get('/prompts', async (req, res) => {
    return (await getAllPromptsService(req, res))
  })
}
