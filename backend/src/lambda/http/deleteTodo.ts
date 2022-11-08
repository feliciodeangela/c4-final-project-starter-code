import 'source-map-support/register'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {deleteToDo} from "../../businessLogic/todos";
import * as middy from 'middy';

export const handler = middy (
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Remove a TODO item by id
        const authorization = event.headers.Authorization;
        const split = authorization.split(' ');
        const jwtToken = split[1];

        const todoId = event.pathParameters.todoId;

        const deleteData = await deleteToDo(todoId, jwtToken);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body:JSON.stringify({
                deleteData
            })
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