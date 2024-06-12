export type Review = {
    _id: string,
    userId: string,
    content: string,
    date: string,
    stars: number,
    finished: boolean,
    likes: number,
    username: string,
    avatar: string,
    spoilers: boolean
  }