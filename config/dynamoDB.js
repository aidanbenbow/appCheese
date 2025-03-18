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

// Function to query DynamoDB using a GSI
async function queryById(id) {
    const params = {
        TableName: 'cheesearticles', // Replace with your table name
        IndexName: 'id-index', // Replace with your GSI name
        KeyConditionExpression: '#id = :id', // Assuming 'id' is the attribute in your GSI
        ExpressionAttributeNames: {
            '#id': 'id' // Use the actual attribute name
        },
        ExpressionAttributeValues: {
            ':id': id // The value you're searching for
        }
    };

    try {
        const result = await docClient.send(new QueryCommand(params));
        return result.Items; // Return the found items
    } catch (err) {
        console.error("Error querying DynamoDB:", err);
        throw err;
    }
}

//function to query by primary and secondary key
export async function queryByTopicAndCreatedAt(topic, createdAt) {
    const params = {
        TableName: 'cheesearticles', // Replace with your table name
        KeyConditionExpression: '#topic = :topic AND #createdAt = :createdAt', // Assuming 'topic' and 'createdAt' are the attributes in your table
        ExpressionAttributeNames: {
            '#topic': 'topic', // Use the actual attribute name
            '#createdAt': 'createdAt' // Use the actual attribute name
        },
        ExpressionAttributeValues: {
            ':topic': topic, // The value you're searching for
            ':createdAt': createdAt // The value you're searching for
        }
    };

    try {
        const result = await docClient.send(new QueryCommand(params));
        return result.Items; // Return the found items
    } catch (err) {
        console.error("Error querying DynamoDB:", err);
        throw err;
    }
}


// Function to get an item from DynamoDB using its primary key
export async function getItem(id) {
    // Query the item first
    const items = await queryById(id);
    
    if (items.length === 0) {
        console.log("Item not found!");
        return;
    }

    return items[0]; // Assuming only one item is returned
}

// Function to delete an item from DynamoDB using its primary key
export async function deleteItem(id) {
    // Query the item first
    const items = await queryById(id);
    
    if (items.length === 0) {
        console.log("Item not found!");
        return;
    }

    const itemToDelete = items[0]; // Assuming only one item is returned

    // Use DeleteItem to delete the found item
    const deleteParams = {
        TableName: 'cheesearticles', // Replace with your table name
        Key: {
            'topic': itemToDelete.topic,
             // Delete by primary key (ensure it's the correct key)
             'createdAt': itemToDelete.createdAt
        }
    };

    try {
        await docClient.send(new DeleteCommand(deleteParams));
        console.log(`Item with id ${id} deleted successfully`);
    } catch (err) {
        console.error("Error deleting item:", err);
    }
}

// Function to update an item in DynamoDB
export async function updateItem(topic, createdAt, updatedAttributes) {
    // Query the item first
    const items = await queryByTopicAndCreatedAt(topic, createdAt);
    
    if (items.length === 0) {
        console.log("Item not found!");
        return;
    }

    const itemToUpdate = items[0]; // Assuming only one item is returned

    // Use UpdateItem to update the found item
    const updateParams = {
        TableName: 'cheesearticles', // Replace with your table name
        Key: {
            'topic': itemToUpdate.topic,
            'createdAt': itemToUpdate.createdAt
        },
        UpdateExpression: 'SET #title = :title, #description = :description, #imageUrl = :imageUrl, #article = :article', // Update the attributes you want
        ExpressionAttributeNames: {
            '#title': 'title',
            '#imageUrl': 'imageUrl',
            '#description': 'description',
            '#article': 'article'
        },
        ExpressionAttributeValues: {
            ':title': updatedAttributes.title,
            ':imageUrl': updatedAttributes.imageUrl,
            ':description': updatedAttributes.description,
            ':article': updatedAttributes.article
        }
    };

    try {
        await docClient.send(new UpdateCommand(updateParams));
        console.log(`Item with id updated successfully`);
    } catch (err) {
        console.error("Error updating item:", err);
    }
}
