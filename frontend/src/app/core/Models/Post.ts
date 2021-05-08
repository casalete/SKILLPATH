export interface Post {
    _id?: string;
    name?: string;
    author?: string;
    authorDisplayName?: string;
    authorScore?: string;
    authorAbout?: string;
    mainTopic?: string;
    description?: string;
    content?: string;
    links: { source: string; target: string; importance: number }[];
    commentList?: string[];
    commentsLength?: number;
    postTopics?: string[];
    votersList?: string[];
    score?: number;
    upVotes?: number;
    downVotes?: number;
}
