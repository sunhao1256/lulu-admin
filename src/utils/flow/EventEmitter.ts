import {getRawType, notNull} from './tools'

const isArray = (obj: any) => getRawType(obj) === 'array'
const isNullOrUndefined = (obj: any) => !notNull(obj)

class EventEmitter {
  static _events: { [key: string]: Function[] } = {}

  constructor() {
  }

  static _addListener(type: string, fn: any, context?: any, once?: any) {
    if (typeof fn !== 'function') {
      throw new TypeError('fn must be a function')
    }

    fn.context = context
    fn.once = !!once

    const event = EventEmitter._events[type]
    // only one, let `this._events[type]` to be a function
    if (isNullOrUndefined(event)) {
      EventEmitter._events[type] = fn
    } else if (typeof event === 'function') {
      // already has one function, `this._events[type]` must be a function before
      EventEmitter._events[type] = [event, fn]
    } else if (isArray(event)) {
      // already has more than one function, just push
      EventEmitter._events[type].push(fn)
    }

    return EventEmitter
  }

  static addListener(type: string, fn: any, context?: any) {
    return EventEmitter._addListener(type, fn, context)
  }

  static on(type: string, fn: any, context?: any) {
    return EventEmitter.addListener(type, fn, context)
  }

  static once(type: string, fn: any, context?: any) {
    return EventEmitter._addListener(type, fn, context, true)
  }

  static emit(type: any, ...rest: any[]) {
    if (isNullOrUndefined(type)) {
      throw new Error('emit must receive at lease one argument')
    }

    const event: any = EventEmitter._events[type]

    if (isNullOrUndefined(event)) return false

    if (typeof event === 'function') {
      event.call(event.context || null, ...rest)
      if (event.once) {
        EventEmitter.removeListener(type, event)
      }
    } else if (isArray(event)) {
      event.map((e: any) => {
        e.call(e.context || null, ...rest)
        if (e.once) {
          EventEmitter.removeListener(type, e)
        }
      })
    }

    return true
  }

  static removeListener(type: any, fn: any) {
    if (isNullOrUndefined(EventEmitter._events)) return EventEmitter

    // if type is undefined or null, nothing to do, just return this
    if (isNullOrUndefined(type)) return EventEmitter

    if (typeof fn !== 'function') {
      throw new Error('fn must be a function')
    }

    const events = EventEmitter._events[type]

    if (typeof events === 'function') {
      events === fn && delete EventEmitter._events[type]
    } else {
      const findIndex = events.findIndex((e) => e === fn)

      if (findIndex === -1) return EventEmitter

      // match the first one, shift faster than splice
      if (findIndex === 0) {
        events.shift()
      } else {
        events.splice(findIndex, 1)
      }

      // just left one listener, change Array to Function
      if (events.length === 1) {
        // @ts-ignore
        EventEmitter._events[type] = events[0]
      }
    }

    return EventEmitter
  }

  static removeAllListeners(type: any) {
    if (isNullOrUndefined(EventEmitter._events)) return EventEmitter

    // if not provide type, remove all
    if (isNullOrUndefined(type)) EventEmitter._events = Object.create(null)

    const events = EventEmitter._events[type]
    if (!isNullOrUndefined(events)) {
      // check if `type` is the last one
      if (Object.keys(EventEmitter._events).length === 1) {
        EventEmitter._events = Object.create(null)
      } else {
        delete EventEmitter._events[type]
      }
    }

    return EventEmitter
  }

  static listeners(type: any) {
    if (isNullOrUndefined(EventEmitter._events)) return []

    const events = EventEmitter._events[type]
    // use `map` because we need to return a new array
    return isNullOrUndefined(events)
      ? []
      : typeof events === 'function'
        ? [events]
        : events.map((o) => o)
  }

  static listenerCount(type: any) {
    if (isNullOrUndefined(EventEmitter._events)) return 0

    const events = EventEmitter._events[type]

    return isNullOrUndefined(events) ? 0 : typeof events === 'function' ? 1 : events.length
  }

  static eventNames() {
    if (isNullOrUndefined(EventEmitter._events)) return []

    return Object.keys(EventEmitter._events)
  }
}

export default EventEmitter
