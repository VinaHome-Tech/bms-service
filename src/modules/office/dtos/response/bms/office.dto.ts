export class DTO_RP_Office {
    id: string;
    name: string;
    code: string;
    address: string;
    note: string;
    status: boolean;
    phones: { id: string; phone: string; type: string }[];
    created_at: Date;
    updated_at: Date;
}