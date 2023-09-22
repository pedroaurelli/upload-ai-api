import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { createReadStream } from 'fs'
import { openai } from '../../lib/openai'

export async function transcriptionVideoService (req: FastifyRequest, res: FastifyReply) {
  const paramsSchema = z.object({
    videoId: z.string().uuid()
  })

  const { videoId } = paramsSchema.parse(req.params)

  const bodySchema = z.object({
    prompt: z.string()
  })

  const { prompt } = bodySchema.parse(req.body)

  const video = await prisma.video.findUnique({
    where: {
      id: videoId
    }
  })

  const videoPath = video?.path

  if (!videoPath) {
    return res.status(404).send({ message: 'Video not found' })
  }

  const audioReadStream = createReadStream(videoPath)

  const response = await openai.audio.transcriptions.create({
    file: audioReadStream,
    model: 'whisper-1',
    language: 'pt',
    response_format: 'json',
    temperature: 0,
    prompt
  })

  const transcription = response.text

  await prisma.video.update({
    where: {
      id: videoId
    },
    data: {
      transcription
    }
  })

  return res.status(201).send(transcription)
}
