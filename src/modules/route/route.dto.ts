export class DTO_RQ_Route {
  base_price: number;
  distance: number;
  e_ticket_price: number;
  journey: string;
  note: string;
  route_name: string;
  route_name_e_ticket: string;
  short_name: string;
  status: boolean;
}
export class DTO_RQ_UpdateRoute {
  id: number;
  base_price: number;
  company_id: number;
  created_by: string;
  distance: number;
  e_ticket_price: number;
  journey: string;
  note: string;
  route_name: string;
  route_name_e_ticket: string;
  short_name: string;
  status: boolean;
}
export class DTO_RP_Route {
  id: number;
  base_price: number;
  distance: number;
  e_ticket_price: number;
  journey: string;
  note: string;
  display_order: number;
  route_name: string;
  route_name_e_ticket: string;
  short_name: string;
  status: boolean;
}

export class DTO_RP_ListRouteName {
  id: number;
  route_name: string;
}

export class DTO_RP_RouteItem {
  id: number;
  route_name: string;
  status: boolean;
}

export class DTO_RQ_RoutePoint {
  point_ids: number[];
}

export class DTO_RP_RoutePoint {
  id: number;
  route_id: number;
  point_id: number;
}
