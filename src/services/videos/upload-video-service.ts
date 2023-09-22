import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import path from 'path'
import { prisma } from '../../lib/prisma'
import { pipeline } from 'stream'
import { promisify } from 'util'
import fs from 'fs'

const pump = promisify(pipeline)

export async function uploadVideoService (req: FastifyRequest, res: FastifyReply) {
  const data = await req.file()

    if (!data) {
      return res.status(400).send({ error: 'Missing file input.'  })
    }

    const extension = path.extname(data.filename)

    if (extension !== '.mp3') {
      return res.status(400).send({ error: 'Invalid input type, please upload a MP3.' })
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = path.resolve(__dirname, '../../../tmp', fileUploadName)

    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination
      }
    })

    return res.status(201).send(video)
}
