export type BlogViewModel = {
    id: string
    name: string
    websiteUrl: string
    createdAt:string
}
export type BlogViewModelWithQuery = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount:number,
    items:Array<BlogViewModel>
}

