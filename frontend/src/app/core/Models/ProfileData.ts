export interface ProfileData {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    rank: { topicName: string; rank: number }[];
    followedTopics: string[];
    followedUsers: string[];
    about?: string;
    displayName?: string;
    achievements: string[];
}
