import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../lambda/utils';
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { APIGatewayProxyEvent } from 'aws-lambda';

// TODO: Implement businessLogic

export function creatingTodo(todoReq: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem{
    const idTodo=uuid.v4();
    const todo={
      todoId: idTodo,
      userId: getUserId(event),
      createdAt:new Date().toISOString(),
      done: false,
      attachmentUrl: "https://via.placeholder.com/150C",
      ...todoReq
    }
    return todo as TodoItem;
}