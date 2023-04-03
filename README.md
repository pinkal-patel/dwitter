Dwitter Application

Backend Programming language : NodeJs 
Database : MongoDB


Following are the details of Database:

following are the Collections along with their respective fields

1. users (to store the user details )
    userId                          -> Unique id for all the records
    userName                        -> Capture the user's username
    email                           -> user's email id
    hash_password                   -> encrypted password
    role                            -> user's roles
    isDeleted                       -> flag which indecates whether user is active or not
    createdAt                       -> user creation date
    updatedAt                       -> user updation date
    deletedAt                       -> user deletion date

2. todos  (to store the user's todos ) :
    userId                           -> userid who had created todo
    todoId                           -> Unique id for all the todos
    title                            -> title of the todo
    status                           -> status of todos (pending, inprocess, completed)
    isDeleted                        -> flag which indecates whether todo is deleted or not
    createdAt                        -> todo creation date
    updatedAt                        -> todo updation date
    deletedAt                        -> todo deletion date


3. posts  (to store the user's posts ) :
    userId                           -> userid who had posted
    postId                           -> Unique id for all the posts
    title                            -> title of the post
    body                             -> content of the post
    isDeleted                        -> flag which indecates whether post is deleted or not
    createdAt                        -> post creation date
    updatedAt                        -> post updation date
    deletedAt                        -> post deletion date


4. comments  (to store the user's comments ) :
    commentId                        -> unique id for all the comments
    userId                           -> userid who had commented
    postId                           -> postid on which user had commented
    name                             -> name of the user who had commented
    body                             -> content of the comment
    isDeleted                        -> flag which indecates whether comment is deleted or not
    createdAt                        -> comment creation date
    updatedAt                        -> comment updation date
    deletedAt                        -> comment deletion date

5. refresh_tokens (to store refresh tokens) :
    userId                           -> userid for whom token is generated
    token                            -> refresh token value
    createdAt                        -> refresh token creation date


Notes:
JWT token is used for sign up and login.
All listing APIs are having pagination and querying support.
Rate Limiting for login API that will allow max 5 attempts for login in 15 mins from a perticular IP.
Redis (caching database) is used for Rate Limiting.
Refresh Token feature is implemented to generate the new access token.


Below Envs will be needed to run the application :

MONGO_URL=mongodb://localhost:27017/dwitter
PORT=9002
NODE_ENV=development
JWT_SECRET=A7HL0W9DT6NS
JWT_REFRESH_SECRET=J3PL1C2DA2GV
JWT_SECRET_EXP=900
JWT_REFRESH_SECRET_EXP=1d


Please find API samples with sample request and response at API_sample_req_res.txt
