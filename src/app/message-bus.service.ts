import {BehaviorSubject, Observable} from 'rxjs';

export class MessageBusService {
  private subject: BehaviorSubject<string> = new BehaviorSubject<string>('app init');

  public getMessages(): Observable<string> {
    return this.subject as Observable<string>;
  }

  public postMessage(message: string) {
    this.subject.next(message);
  }
}
