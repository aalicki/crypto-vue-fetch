/**
 * HTTP request layer
 * if auth is required return patched axios instance(with access token in headers)
 * else return clear axios instance
 */

import axios from 'axios'

import { API_URL } from '../.env'

export class Http {
  constructor (status) {
    this.instance = axios.create({
      baseURL: API_URL
    })

    return this.init()
  }

  init () {
    return this.instance
  }
}
