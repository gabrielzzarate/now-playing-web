import useSWR, { SWRResponse, SWRConfiguration } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { flattenObject, isServer } from '@lib/utils'
import type {
  Base,
  AnyKeys,
  HttpMethod,
  HttpHeaders,
  HttpBody,
  HttpParams,
  ListParams,
  ReadParams
} from './types'
import { apiHost } from '@lib/env'
import { ApiError } from './utils'

export class Service<Model extends Base> {
  basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  async read(id: string, params?: ReadParams): Promise<Model> {
    return this.get(`${this.basePath}/${id}`, params ? flattenObject(params) : undefined)
  }

  async create(body: AnyKeys<Model>): Promise<Model> {
    return this.post(`${this.basePath}`, body)
  }

  async list(params?: ListParams<Model>): Promise<Model[]> {
    return this.get(`${this.basePath}`, params ? flattenObject(params) : undefined)
  }

  async readAndUpdate(id: string, body: AnyKeys<Model>): Promise<Model> {
    return this.put(`${this.basePath}/${id}`, body)
  }

  async readAndDelete(id: string, params?: HttpParams): Promise<Model> {
    return this.delete(`${this.basePath}/${id}`, params)
  }

  async get<T>(path: string, params?: HttpParams): Promise<T> {
    return this.request({ path, method: 'get', params })
  }

  async delete<T>(path: string, params?: HttpParams): Promise<T> {
    return this.request({ path, method: 'delete', params })
  }

  async post<T>(path: string, body?: HttpBody): Promise<T> {
    return this.request({ path, method: 'post', body })
  }

  async put<T>(path: string, body?: HttpBody): Promise<T> {
    return this.request({ path, method: 'put', body })
  }

  async patch<T>(path: string, body: HttpBody): Promise<T> {
    return this.request({ path, method: 'patch', body })
  }

  async request<T>(props: {
    path: string
    method: HttpMethod
    params?: HttpParams
    body?: HttpBody
  }): Promise<T> {
    // Build request
    const req = this.buildAuthRequest(props)

    // Issue request
    const res = await fetch(`${apiHost}/api/${req.path}`, {
      method: props.method.toUpperCase(),
      body: req.body,
      headers: {
        'content-type': 'application/json',
        ...req.headers
      }
    })

    // Parse json response
    const json = await res.json()

    // Throw response as an error if we did not receive a 200
    if (!res.ok) {
      // if (res.status === 401 && req.path !== '/auth/login') {
      //   this.handleUnauthorizedRequest()
      // }
      throw new ApiError(res.status, json.message, json.error)
    }

    return json?.result ? json.result : json
  }

  // private handleUnauthorizedRequest() {
  //   if (isServer) return
  //   useAuthStore.getState().clear()
  //   const url = `/auth?from=${encodeURIComponent(window.location.pathname)}`
  //   setTimeout(() => (window.location.href = url), 100)
  // }

  private buildAuthRequest(props: {
    path: string
    method: HttpMethod
    params?: HttpParams
    body?: HttpBody
  }): { path: string; headers: HttpHeaders; body?: string } {
    // const credentials = useAuthStore.getState().credentials

    const timestamp = Date.now()

    let params = undefined
    let body = undefined

    switch (props.method) {
      case 'get':
      case 'delete':
      case 'options': {
        params = props.params
          ? Object.keys(props.params)
              .sort()
              .filter(
                (key: string) => props.params?.[key] !== undefined && props.params?.[key] !== null
              )
              .map((key: string) => [
                encodeURIComponent(key),
                encodeURIComponent(props.params?.[key] as string | number | boolean)
              ])
              .map(([key, value]) => `${key}=${value}`)
              .join('&')
          : ''
        break
      }
      case 'post':
      case 'put':
      case 'patch': {
        body = JSON.stringify(props.body ?? {})
        break
      }
      default:
        throw new Error('Invalid request method')
    }

    // const signature = credentials
    //   ? hmac(`${timestamp}.${props.method}.${props.path}.${params ?? body}`, credentials.privateKey)
    //   : undefined

    return {
      path: [props.path, params].filter(Boolean).join('?'),
      body: body,
      headers: {
        // authorization: credentials ? `bearer ${credentials.publicKey}` : undefined,
        // 'x-api-timestamp': timestamp.toString(),
        // 'x-api-signature': signature?.toString()
      }
    }
  }
}

export type { SWRConfiguration }

export function useRead<T extends Base>(
  service: Service<T>,
  id: string | null | undefined,
  params?: ReadParams,
  config?: SWRConfiguration
): SWRResponse<T, Error> {
  const cacheKey = JSON.stringify(params ?? {})
  const fetcher = () => {
    if (!id) return undefined
    return service.read(id as string, params)
  }
  return useSWR(
    id === undefined || id === null ? null : [`/${service.basePath}/${id}`, cacheKey],
    fetcher,
    config
  )
}

export function useList<T extends Base>(
  service: Service<T>,
  params?: ListParams<T>,
  config?: SWRConfiguration
): SWRResponse<T[], Error> {
  const cacheKey = JSON.stringify(params ?? {})
  const fetcher = () => service.list(params)
  return useSWR([`/${service.basePath}`, cacheKey], fetcher, config)
}

export function useListSafe<T extends Base>(
  service: Service<T>,
  params: ListParams<T>,
  checkFor: Partial<keyof T>,
  config?: SWRConfiguration
): SWRResponse<T[], Error> {
  const cacheKey = JSON.stringify(params ?? {})
  const fetcher = () => {
    if (!params[checkFor]) return
    else return service.list(params)
  }
  return useSWR([`/${service.basePath}`, cacheKey], fetcher, config)
}

export function useGet<T>(
  service: Service<any>,
  path: string,
  params?: HttpParams,
  config?: SWRConfiguration
): SWRResponse<T, Error> {
  const cacheKey = JSON.stringify(params ?? {})
  const fetcher = () => service.get<T>(path, params)
  return useSWR([path, cacheKey], fetcher, config)
}

export function useGetImmutable<T>(
  service: Service<any>,
  path: string,
  params?: HttpParams,
  config?: SWRConfiguration
): SWRResponse<T, Error> {
  const cacheKey = JSON.stringify(params ?? {})
  const fetcher = () => service.get<T>(path, params)
  return useSWRImmutable([path, cacheKey], fetcher, config)
}
