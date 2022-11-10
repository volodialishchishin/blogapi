import express, {Request, Response} from 'express'
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";

const app = express()
const port =  process.env.PORT || 8000

app.use(express.json())
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)
app.listen(port,()=>{
    console.log(`Server working on ${port}`)
})
