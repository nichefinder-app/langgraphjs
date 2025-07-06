import { 
    MemorySaver,
} from "@langchain/langgraph"
export interface APISaver {
    initialize(cwd: string): Promise<APISaver>;
    clear(): Promise<void> | void;
    delete(threadId: string, runId: string | null | undefined): Promise<void>;
    copy(threadId: string, newThreadId: string): Promise<void> | void;
    getTuple(...args: Parameters<MemorySaver["getTuple"]>): ReturnType<MemorySaver["getTuple"]>
    list(...args: Parameters<MemorySaver["list"]>): ReturnType<MemorySaver["list"]>
    putWrites(...args: Parameters<MemorySaver["putWrites"]>): ReturnType<MemorySaver["putWrites"]>
    put(...args: Parameters<MemorySaver["put"]>): ReturnType<MemorySaver["put"]>
    toJSON(): string;
}