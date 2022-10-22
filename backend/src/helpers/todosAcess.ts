import * as AWS from 'aws-sdk'
const AWSXRay=require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient();
const todoTable = process.env.TODOS_TABLE
const index=process.env.TODOS_CREATED_AT_INDEX;
// TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todoTable,
      Item: todo
    }).promise()
    return todo as TodoItem;
}
export async function getTodosById(userId: string): Promise<TodoItem[]> {
  const res=await docClient.query({
    TableName: todoTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues:{
      ':userId': userId
    }
  }).promise()
  return res.Items as TodoItem[];
}
export async function getTodos(todoId:string): Promise<TodoItem>{
  const res=await docClient.query({
    TableName: todoTable,
    IndexName:index,
    KeyConditionExpression:'todoId= :todoId',
    ExpressionAttributeValues:{ 
      ':todoId': todoId
    }
  }).promise();
  if(res.Items.length != 0){
    return res.Items[0] as TodoItem;
  }
  return null
}
export async function updateTodos(todo:TodoItem): Promise<TodoItem>{
  await docClient.update({
    TableName: todoTable,
    Key:{
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression:'set attachmentUrl= :attachmentUrl',
    ExpressionAttributeValues:{ 
      ':attachmentUrl': todo.attachmentUrl
    }
  }).promise();
  return todo as TodoItem;
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
    return new XAWS.DynamoDB.DocumentClient()
}