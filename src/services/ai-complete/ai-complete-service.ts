import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { openai } from '../../lib/openai'
import { OpenAIStream, streamToResponse } from 'ai'

export async function aiCompleteService (req: FastifyRequest, res: FastifyReply) {
  const bodySchema = z.object({
    videoId: z.string().uuid(),
    template: z.string(),
    temperature: z.number().min(0).max(1).default(0.5),
  })

  const { temperature, template,videoId } = bodySchema.parse(req.body)

  const video = await prisma.video.findUniqueOrThrow({
    where: {
      id: videoId
    }
  })

  if (!video.transcription) {
    return res.status(400).send({ message: 'Video transcription was not generate yet.' })
  }

  const promptMessage = template.replace('{transcription}', video.transcription)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature,
    messages: [
      { role: 'user', content: promptMessage }
    ],
    stream: true
  })

  const stream = OpenAIStream(response)

  streamToResponse(stream, res.raw, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE OPTIONS'
    }
  })
}
