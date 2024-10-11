import { FastifyReply, FastifyRequest } from 'fastify'

class RefreshTokenController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify({ onlyCookie: true })

    const token = await reply.jwtSign(
      {
        role: request.user.role,
      },
      {
        sign: {
          sub: request.user.sub,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: request.user.role,
      },
      {
        sign: {
          sub: request.user.sub,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken)
      .status(200)
      .send({ token })
  }
}

export default RefreshTokenController
