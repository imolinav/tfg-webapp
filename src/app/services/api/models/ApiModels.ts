export interface Recommendations {
  id: number;
  name: string;
  avg: number;
};

export interface Entity {
    id: number;
    name: string;
    score: number;
    address: string;
}

export interface User {
    id: number;
    name: string;
    lastname: string;
    email: string;
    gender: string;
}

export interface City {
  id: number;
  name: string;
  avg?: number;
  attractions?: Entity[];
  restaurants?: Entity[];
  latitude?: string;
  longitude?: string;
  population?: number;
  altitude?: number;
  govern_party?: string;
}
