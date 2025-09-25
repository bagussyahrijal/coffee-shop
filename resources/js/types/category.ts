export type Category = {
    id: number;
    name: string;
    icon: string;
    is_available: boolean;
    items_count?: number;
    created_at: string;
    updated_at: string;
};