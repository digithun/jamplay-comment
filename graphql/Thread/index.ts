import { Model } from 'mongoose'
import { TypeComposer } from 'graphql-compose'
import composeWithMongoose from 'graphql-compose-mongoose'

import enchanceCreate from './create.resolver'
import schema from './thread.schema'

export default {
  schema,
  createTypeComposer: (ThreadModel): TypeComposer => {
    const typeComposer = composeWithMongoose(ThreadModel) as TypeComposer
    enchanceCreate(typeComposer)
    return typeComposer
  },
  createGraphQLRelation: (typeComposers) => {
    typeComposers.Thread.addFields({
      userReaction: {
        type: typeComposers.Reaction,
        resolve: (source, args, context: GQResolverContext) => {
          if (!context.userId) {
            return null
          }
          return context.models.Reaction.findOne({ userId: context.userId, contentId: source._id, contentType: "THREAD" })
        }
      }
    })

    typeComposers.Thread.addRelation('comments', {
      resolver: typeComposers.Comment.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({ threadId: source._id.toString(), replyToId: null })
      }
    })

    typeComposers.Thread.addRelation('commentConnection', {
      resolver: typeComposers.Comment.getResolver('connection'),
      prepareArgs: {
        filter: (source) => ({ threadId: source._id.toString(), replyToId: null })
      }
    })
  }
} as GQTypeComposerStrategy<GQThreadDocument>
