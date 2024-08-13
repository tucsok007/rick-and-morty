interface IPaginatedEndpointInfo {
  count: number;
  next: string | null;
  pages: number;
  prev: string | null;
}

interface ILocation {
  name: string;
  url: string;
}

export interface ICharacter {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: ILocation;
  location: ILocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface IEpisode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface IPaginatedEndpoint {
  info: IPaginatedEndpointInfo;
}

export interface ICharacterEndpointData extends IPaginatedEndpoint {
  results: ICharacter[];
}
