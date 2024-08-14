# S3 Utility Class
- This is a utility class to interact with AWS S3 buckets and objects. It provides methods for performing basic CRUD operations on buckets and objects.

## Dependencies: 
- @aws-sdk/client-s3 - ^3.629.0
  ```bash
  npm i @aws-sdk/client-s3@3.629.0
  ```

### Functions included are:
- Create a new bucket
- List all buckets
- Delete a bucket
- Upload an object to a bucket with public read access
- Get a public URL for an object
- List objects in a bucket
- Download an object from a bucket
- Delete an object from a bucket
- Make an object public (if not done during upload)
