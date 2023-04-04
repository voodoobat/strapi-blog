'use strict'

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories

const uid = 'api::post.post'
module.exports = createCoreController(uid, {
  async create(ctx) {
    const { data } = ctx.request.body
    const input = await this.sanitizeInput(data, ctx)
    input.user = ctx.state.user // add current user into post data

    const entity = await strapi.entityService.create(uid, { data: input })
    const output = await this.sanitizeOutput(entity, ctx)

    return this.transformResponse(output, null)
  },

  async update(ctx) {
    const { params, body } = ctx.request
    const { user } = await strapi.entityService.findOne(uid, params.id, {
      populate: ['user'],
    })

    // if current user is post owner
    if (user.id === ctx.state.user.id) {
      const input = await this.sanitizeInput(body.data, ctx)
      const entity = await strapi.entityService.update(uid, params.id, {
        data: input,
      })
      const output = await this.sanitizeOutput(entity, ctx)

      return this.transformResponse(output, null)
    }
  },

  async delete(ctx) {
    const { id } = ctx.request.params
    const { user } = await strapi.entityService.findOne(uid, id, {
      populate: ['user'],
    })

    // if current user is post owner
    if (user.id === ctx.state.user.id) {
      const entity = await strapi.entityService.delete(uid, id, null)
      const output = await this.sanitizeOutput(entity, ctx)

      return this.transformResponse(output, null)
    }
  },
})
