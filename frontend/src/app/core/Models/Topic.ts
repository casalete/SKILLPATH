export interface Topic {
    name: string;
    postsCount?: number;
    suggestedTopics: string[];
    selected?: boolean;
    followers: number;
}
