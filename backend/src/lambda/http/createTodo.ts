import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../helpers/todosAcess' 
import { creatingTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    console.log(newTodo);
    const todo=creatingTodo(newTodo,event);
    await createTodo(todo);
    return {
      statusCode: 201,
      body: JSON.stringify({todo})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
