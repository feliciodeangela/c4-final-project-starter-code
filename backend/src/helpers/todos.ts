//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { APIGatewayProxyEvent } from 'aws-lambda';


// TODO: Implement businessLogic

export function creatingTodo(todoReq: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem{
    const idTodo=uuid.v4();
    const todo={
      todoId: idTodo,
      userId: getUserId(event),
      createdAt: Date(),
      name: todoReq.name,
      dueDate: todoReq.dueDate,
      done: false,
      attachmentUrl: "http://example.com/image.png"
    }
    return todo as TodoItem;
}