import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as jwt from 'jsonwebtoken'

interface User {
  id: string
}

interface TokenPayload {
    token: string
}

export default async (event: FunctionEvent<TokenPayload>) => {

  try {
    // no logged in user
    if (!event.data || !event.data.token) {
      return { data: null }
    }

    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    const { userId } = jwt.verify(event.data.token, 'thisIsSuperSecret');
    // get user by id
    const user: User = await getUser(api, userId)
      .then(r => r.User)
    return { data: {id: user.id}}
  } catch (e) {
    return { error: 'An unexpected error occured during authentication.' }
  }
}

async function getUser(api: GraphQLClient, id: string): Promise<{ User }> {
  const query = `
    query getUser($id: ID!) {
      User(id: $id) {
        id
      }
    }
  `

  const variables = {
    id,
  }

  return api.request<{ User }>(query, variables)
}