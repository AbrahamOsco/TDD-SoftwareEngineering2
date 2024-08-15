export interface Action{
    apply(): Promise<void>;
} 