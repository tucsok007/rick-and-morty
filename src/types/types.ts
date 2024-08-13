export interface IColumnDefinition<T> {
  field: keyof T;
  displayName: string;
  renderer?: (data: T) => React.ReactNode;
}

export type QueryStatus = 'loading' | 'error' | 'successful';
