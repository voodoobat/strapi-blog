'use strict'

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories
const { slugify } = require('#src/utilities/slugify.js')

const uid = 'api::post.post'
module.exports = createCoreController(uid, {
  async create(ctx) {
    const { data } = ctx.request.body
    const input = await this.sanitizeInput(data, ctx)
    input.user = ctx.state.user // add current user into post data

    // generate slug from title
    if (!input.slug) {
      input.slug = slugify(input.title)
    }

    const entity = await strapi.entityService.create(uid, { data: input })
    const output = await this.sanitizeOutput(entity, ctx)

    return this.transformResponse(output, null)
  },

  async update(ctx) {
    const { params, body } = ctx.request
    const found = await strapi.entityService.findOne(uid, params.id, {
      populate: ['user'],
    })

    // if current user is post owner
    if (found.user.id === ctx.state.user.id) {
      const input = await this.sanitizeInput(body.data, ctx)

      // generate slug from title
      if (!input.slug && !found.slug) {
        input.slug = slugify(input.title || found.title)
      }

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
