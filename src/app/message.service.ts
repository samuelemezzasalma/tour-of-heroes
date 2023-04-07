import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = []

  /**
   * add
   */
  public add(message: string) {
    this.messages.push(message)
  }

  /**
   * clear
   */
  public clear() {
    this.messages = []
  }

  constructor() { }
}
