import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";


export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
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
        return res.Items as TodoItem[];
      }
    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        const result = await this.docClient.put({
                TableName: this.todoTable,
                Item: todoItem,
            }
        ).promise();
        console.log(result);

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

        return "" as string;
    }

    async generateUploadUrl(todoId: String): Promise<String> {
        const url = this.s3Client.getSignedUrl('putObject',{
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        return url as String;
    }
}