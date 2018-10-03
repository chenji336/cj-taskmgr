export interface Project {
    id?: number;
    name: string;
    desc?: string;
    coverImg: string;
    taskLists?: string[]; // 列表id
    memebers?: string[]; // 列员id
}