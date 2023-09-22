import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'

export async function getAllPromptsService (req: FastifyRequest, res: FastifyReply) {
  const prompts = await prisma.prompt.findMany()

  return res.status(200).send(prompts)
}
