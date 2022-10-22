import 'source-map-support/register'
import { getTodosById } from '../../helpers/todosAcess'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
// import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const todos = await getTodosById(getUserId(event));
    return {
      statusCode:200,
      body:JSON.stringify({items:todos})
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
