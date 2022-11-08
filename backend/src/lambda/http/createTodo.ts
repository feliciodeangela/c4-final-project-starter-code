import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {createToDo} from "../../businessLogic/todos";
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as middy from 'middy';

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Implement creating a new TODO item
        console.log("Processing Event ", event);
        const authorization = event.headers.Authorization;
        const split = authorization.split(' ');
        const jwtToken = split[1];

        const newTodo: CreateTodoRequest = JSON.parse(event.body);
        const toDoItem = await createToDo(newTodo, jwtToken);

        return {
            statusCode: 201,
            body: JSON.stringify({
                "item": toDoItem
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    }
)
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )