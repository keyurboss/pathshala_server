export interface GetUserDetailsParams {
  id?: string | string[];
  unique_id?: string | string[];
  password?: string;
  user_id?: string | string[];
}

export interface CalculateDataint {
  no_gatha: number;
  done: boolean;
  day: number;
}

export interface FetchPointsInterFace {
  group_by?: {
    type?: boolean;
    day?: boolean;
    month?: boolean;
    year?: boolean;
    status?: boolean;
  };
  fetch_to_display?: boolean;
  order_by?: 'desc' | 'asc';
  nolimit?: boolean;
  limit?: number;
  stream?: number;
  status?: string | string[];
  user_id?: string | string[];
  month?: string | string[];
  day?: string | string[];
  year?: string | string[];
  point_type?: string | string[];
}
