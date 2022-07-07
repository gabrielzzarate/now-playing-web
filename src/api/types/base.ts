export interface Base {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type AnyKeys<T> = { [P in keyof T]?: T[P] | any }
export type Ref<T> = Partial<T> | string
