import { FastifyInstance } from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import { uploadVideoService } from '../services/videos/upload-video-service'
import { transcriptionVideoService } from '../services/videos/transcription-video-service'

export async function videoController(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25 // 25 MB
    }
  })

  app.post('/videos', async (req, res) => {
    await uploadVideoService(req, res)
  })

  app.post('/videos/:videoId/transcription', async (req, res) => {
    await transcriptionVideoService(req, res)
  })
}
