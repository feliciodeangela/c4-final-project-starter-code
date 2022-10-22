import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodos, updateTodos } from '../../helpers/todosAcess'
import { getUrl } from '../../helpers/attachmentUtils'
//import { TodoItem } from '../../models/TodoItem'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
const s3=process.env.ATTACHMENT_S3_BUCKET;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log(todoId);
    const todo=await getTodos(todoId);
    todo.attachmentUrl=`https://${s3}.s3.amazonaws.com/${todoId}`;
    await updateTodos(todo);
    const url=await getUrl(todoId);
    return {
      statusCode:201,
      body:JSON.stringify({
        uploadUrl:url
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
