/*
Title:   S3 Utility Class
Author:  Sanjay Kumar
Date:    14/08/2024
Description: This is a utility class to interact with AWS S3 buckets and objects.
It provides methods for performing basic CRUD operations on buckets and objects.
Dependencies: @aws-sdk/client-s3 - ^3.629.0
Functions included are:
- Create a new bucket
- List all buckets
- Delete a bucket
- Upload an object to a bucket with public read access
- Get a public URL for an object
- List objects in a bucket
- Download an object from a bucket
- Delete an object from a bucket
- Make an object public (if not done during upload)
*/

const {
    S3Client,
    CreateBucketCommand,
    ListBucketsCommand,
    DeleteBucketCommand,
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
    PutObjectAclCommand,
} = require("@aws-sdk/client-s3");

class S3Util {
    constructor(region, accessKeyId, secretAccessKey) {
        // Initialize the S3 client with provided credentials and region
        this.s3 = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    // Create a new bucket
    async createBucket(bucketName) {
        const params = { Bucket: bucketName };
        try {
            await this.s3.send(new CreateBucketCommand(params));
            console.log(`Bucket "${bucketName}" created successfully.`);
        } catch (err) {
            console.error(`Error creating bucket "${bucketName}":`, err.message);
            throw err;
        }
    }

    // List all buckets
    async listBuckets() {
        try {
            const data = await this.s3.send(new ListBucketsCommand({}));
            console.log("Buckets:", data.Buckets);
            return data.Buckets;
        } catch (err) {
            console.error("Error listing buckets:", err.message);
            throw err;
        }
    }

    // Delete a bucket
    async deleteBucket(bucketName) {
        const params = { Bucket: bucketName };
        try {
            await this.s3.send(new DeleteBucketCommand(params));
            console.log(`Bucket "${bucketName}" deleted successfully.`);
        } catch (err) {
            console.error(`Error deleting bucket "${bucketName}":`, err.message);
            throw err;
        }
    }

    // Upload an object to a bucket with public read access
    async uploadObject(bucketName, key, body) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
            ACL: "public-read",
        };
        try {
            await this.s3.send(new PutObjectCommand(params));
            console.log(
                `Object "${key}" uploaded to bucket "${bucketName}" successfully.`,
            );
        } catch (err) {
            console.error(`Error uploading object "${key}":`, err.message);
            throw err;
        }
    }

    // Get a public URL for an object
    async getPublicUrl(bucketName, key) {
        try {
            const publicUrl = `https://${bucketName}.s3.${this.s3.config.region}.amazonaws.com/${key}`;
            console.log(`Public URL: ${publicUrl}`);
            return publicUrl;
        } catch (err) {
            console.error("Error generating public URL:", err.message);
            throw err;
        }
    }

    // List objects in a bucket
    async listObjects(bucketName) {
        const params = { Bucket: bucketName };
        try {
            const data = await this.s3.send(new ListObjectsV2Command(params));
            console.log(`Objects in bucket "${bucketName}":`, data.Contents);
            return data.Contents;
        } catch (err) {
            console.error(
                `Error listing objects in bucket "${bucketName}":`,
                err.message,
            );
            throw err;
        }
    }

    // Download an object from a bucket
    async downloadObject(bucketName, key) {
        const params = { Bucket: bucketName, Key: key };
        try {
            const data = await this.s3.send(new GetObjectCommand(params));
            console.log(
                `Object "${key}" downloaded from bucket "${bucketName}" successfully.`,
            );
            return data.Body;
        } catch (err) {
            console.error(`Error downloading object "${key}":`, err.message);
            throw err;
        }
    }

    // Delete an object from a bucket
    async deleteObject(bucketName, key) {
        const params = { Bucket: bucketName, Key: key };
        try {
            await this.s3.send(new DeleteObjectCommand(params));
            console.log(
                `Object "${key}" deleted from bucket "${bucketName}" successfully.`,
            );
        } catch (err) {
            console.error(`Error deleting object "${key}":`, err.message);
            throw err;
        }
    }

    // Make an object public (if not done during upload)
    async makeObjectPublic(bucketName, key) {
        const params = { Bucket: bucketName, Key: key, ACL: "public-read" };
        try {
            await this.s3.send(new PutObjectAclCommand(params));
            console.log(`Object "${key}" in bucket "${bucketName}" is now public.`);
        } catch (err) {
            console.error(`Error making object "${key}" public:`, err.message);
            throw err;
        }
    }
}

module.exports = S3Util;


/*

Example Usage:

--------------------------------------------- Initialization ---------------------------------------------
const s3Util = new S3Util("us-west-2", "your-access-key-id", "your-secret-access-key");

--------------------------------------------- CRUD Operations on Buckets ---------------------------------------------
s3Util.createBucket("bucketName")
s3Util.listBuckets()
s3Util.deleteBucket("bucketName")

--------------------------------------------- CRUD Operations on Objects ---------------------------------------------
s3Util.uploadObject("bucketName", "key", "body") -- body can be a file stream or buffer
s3Util.listObjects("bucketName")
s3Util.downloadObject("bucketName", "key")
s3Util.deleteObject("bucketName", "key")

--------------------------------------------- Public Access Operations ---------------------------------------------
s3Util.makeObjectPublic("bucketName", "key")
s3Util.getPublicUrl("bucketName", "key")

*/ 
