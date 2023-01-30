export enum LikeInfoViewModelValues {
    like = 'Like',
    none = 'None',
    dislike = 'Dislike'
}

export type LikeInfoViewModel =   {
    likesCount:number
    dislikesCount:number
    myStatus:LikeInfoViewModelValues,
}
