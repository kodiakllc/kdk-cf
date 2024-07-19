export interface PageRule {
    id: string;
    status: string;
    targets: Array<{ target: string; constraint: { operator: string; value: string } }>;
    actions: Array<{ id: string; value: any }>;
}
