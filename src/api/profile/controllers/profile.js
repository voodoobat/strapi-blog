'use strict'

/**
 * profile controller
 */

const { createCoreController } = require('@strapi/strapi').factories

const uid = 'api::profile.profile'
module.exports = createCoreController(uid, {
  async find(ctx) {
    if (!ctx.state.user) return // if is unauthorized

    const entities = await strapi.entityService.findMany(uid, {
      filters: { user: ctx.state.user.id },
    })

    // create profile if entity not found
    if (!entities.length) {
      const data = {
        displayName: ctx.state.user.username,
        user: ctx.state.user,
      }

      const entity = await strapi.entityService.create(uid, { data })
      const output = await this.sanitizeOutput(entity, ctx)

      return this.transformResponse(output, null)
    }

    // return founded entity
    const output = await this.sanitizeOutput(entities[0], ctx)

    return this.transformResponse(output, null)
  },
})
