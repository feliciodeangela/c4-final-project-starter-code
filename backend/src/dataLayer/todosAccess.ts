import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { createLogger } from '../utils/logger'
const logger = createLogger('TodosAccess')
const AWSXRay=require('aws-xray-sdk')

const XAWS=AWSXRay.captureAWS(AWS);
export class ToDoAccess {
    constructor(
        //private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        //private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) {}

    async getAllToDos(userId: String): Promise<TodoItem[]> {
        const result = await this.docClient.query({
                TableName: this.todoTable,
                KeyConditionExpression: "#userId = :userId",
                ExpressionAttributeNames: {
                    "#userId": "userId"
                },
                ExpressionAttributeValues: {
                    ":userId": userId
                }
            }
        ).promise();
        const items = result.Items;
        logger.info('Retrieved Todos',items);
        return items as TodoItem[];
    }
    async getTodosById(userId: string): Promise<TodoItem[]> {
        const res=await this.docClient.query({
          TableName: this.todoTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues:{
            ':userId': userId
          }
        }).promise()
        logger.info('Retrieved Todo',res.Items);
        return res.Items as TodoItem[];
      }
    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        const result = await this.docClient.put({
                TableName: this.todoTable,
                Item: todoItem,
            }
        ).promise();
        logger.info('Created Todo',result);
        return todoItem as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: String, userId: String): Promise<TodoUpdate> {
        const result = await this.docClient.update({
                TableName: this.todoTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
                UpdateExpression: "set #a = :a, #b = :b, #c = :c",
                ExpressionAttributeNames: {
                    "#a": "name",
                    "#b": "dueDate",
                    "#c": "done"
                },
                ExpressionAttributeValues: {
                    ":a": todoUpdate['name'],
                    ":b": todoUpdate['dueDate'],
                    ":c": todoUpdate['done']
                },
                ReturnValues: "ALL_NEW"
            }
        ).promise();
        const todo = result.Attributes;
        logger.info('Updated Todo',result.Attributes);
        return todo as TodoUpdate;
    }

    async deleteToDo(todoId: String, userId: String): Promise<String> {
        const result = await this.docClient.delete({
                TableName: this.todoTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
            }
        ).promise();
        console.log(result);
        logger.info('Deleted Todo',result);
        return "" as string;
    }

    async generateUploadUrl(todoId: String): Promise<String> {
        const url = this.s3Client.getSignedUrl('putObject',{
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        logger.info('Retrieved Pre Signed url for bucket: ',url);
        return url as String;
    }
}
// function createDynamoDBClient() {
//     if (process.env.IS_OFFLINE) {
//       console.log('Creating a Local DynamoDB instance')
//       return new XAWS.DynamoDB.DocumentClient({
//         region: 'localhost',
//         endpoint: 'http://localhost:8000'
//       })
//     }