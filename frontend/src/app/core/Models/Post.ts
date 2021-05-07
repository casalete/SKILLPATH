export interface Post {
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
    postTopics?: string[];
    votersList?: string[];
    score?: number;
    upVotes?: number;
    downVotes?: number;
}
