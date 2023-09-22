import { FastifyInstance } from 'fastify'
import { aiCompleteService } from '../services/ai-complete/ai-complete-service'

export async function aiCompleteController (app: FastifyInstance) {
  app.post('/ai/complete', async (req, res) => {
    await aiCompleteService(req, res)
  })
}
