import express from 'express'
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {BlogViewModel} from "./models/Blog/BlogViewModel";
import {PostViewModel} from "./models/Post/PostViewModel";
import {blogsCollection, commentsCollection, postsCollection, runDb, usersCollection} from "./DB/db";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
export let blogs: Array<BlogViewModel> = []
export let posts: Array<PostViewModel> = []
const app = express()
const port =  process.env.PORT || 8001


app.use(express.json())
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)
app.use('/users',usersRouter)
app.use('/auth',authRouter)
app.use('/comments',usersRouter)
app.delete('/testing/all-data',async (req,res)=>{
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    res.sendStatus(204)
})
app.listen(port,async ()=>{
    await runDb()
    console.log(`Server working on ${port}`)
})

