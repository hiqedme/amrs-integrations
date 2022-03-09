import { EventSubscriber, On } from "event-dispatch/decorators";

@EventSubscriber()
export default class ErrorSubscriber {
  @On("failure")
  public onFailure(params: any) {
    // Write error to Db
  }
  @On("success")
  public onSuccess(params: any) {
    // Acknowledge and update status of prescription
  }
}
