export interface Post {
    name?: string;
    author?: string;
    mainTopic?: string;
    description?: string;
    content?: string;
    links: { source: string; target: string; importance: number }[];
    commentList?: string[];
    postTopics?: string[];
    votersList?: string[];
    score?: number;
}
