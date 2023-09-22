import { fastify } from 'fastify'
import { promptsController } from './controllers/prompts-controller'
import { videoController } from './controllers/video-controller'
import { aiCompleteController } from './controllers/ai-complete-controller'
import fastifyCors from '@fastify/cors'

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})
app.register(promptsController)
app.register(videoController)
app.register(aiCompleteController)

app
  .listen({
    port: 3333
  })
  .then(() => {
    console.log('Server is listening on port 3333')
  })
