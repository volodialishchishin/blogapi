import express, {Request, Response} from 'express'
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {BlogViewModel} from "./models/BlogViewModel";
import {PostViewModel} from "./models/PostViewModel";
export let blogs: Array<BlogViewModel> = []
export let posts: Array<PostViewModel> = []
const app = express()
const port =  process.env.PORT || 8000


app.use(express.json())
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)
app.delete('/testings/all-data',(req,res)=>{
    blogs = []
    posts = []
    res.sendStatus(204)
})
app.listen(port,()=>{
    console.log(`Server working on ${port}`)
})

