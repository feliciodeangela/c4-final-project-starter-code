import 'source-map-support/register'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic/todos";
import * as middy from 'middy';

export const handler =middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
        console.log("Processing Event ", event);
        const todoId = event.pathParameters.todoId;

        const URL = await generateUploadUrl(todoId);

        return {
            statusCode: 202,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                uploadUrl: URL,
            })
        };
    }
)
handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )