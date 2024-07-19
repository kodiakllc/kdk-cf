export interface RedirectRule {
    id: string;
    description: string;
    phase: string;
    rules: Array<{
        action: string;
        action_parameters: {
            from_value: {
                preserve_query_string: boolean;
                status_code: number;
                target_url: {
                    expression: string;
                };
            };
        };
        expression: string;
        version: string;
    }>;
}
