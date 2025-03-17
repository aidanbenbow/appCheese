import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from 'dotenv';
dotenv.config();

const AWS_ACCESS_KEY_ID= process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY= process.env.AWS_SECRET_ACCESS_KEY

 const AWS_REGION='eu-central-1'

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: AWS_REGION,
//   credentials: { 
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY 
//   }
});
const docClient = DynamoDBDocumentClient.from(client);

// create cheese article
export async function createCheeseArticle(article) {
  const params = {
    TableName: 'cheesearticles',
    Item: article
  };
  
    try {
        await docClient.send(new PutCommand(params));
        console.log('Article created successfully');
    } catch (err) {
        console.error(err);
    }
}

// get all cheese articles and sort by topic (soft cheese, hard cheese, general) and then createdAt
export async function getAllCheeseArticles() {
  const params = {
    TableName: 'cheesearticles',
  };
  
    try {
        const data = await docClient.send(new ScanCommand(params));
        return data.Items;
    } catch (err) {
        console.error(err);
    }
}

