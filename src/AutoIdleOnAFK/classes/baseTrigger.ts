export default abstract class BaseTrigger {
  abstract start(): void;
  abstract stop(): void;
  /**
   * This method is used to test if all the required modules are present for
   * the following action to run. can store the test result in `_selfTestResult`
   * for other methods to make changes accordingly
   */
  abstract selfTest(): boolean;
  abstract getSettings(): HTMLElement;

  private _selfTestResult: any;

  constructor() {
    this.selfTest();
  }
}

/**
 * action to be executed that will be called to when plugin decides to go afk
 */
export interface AfkAction {
  afkAction(): void;
}
/**
 * Action to be executed when plugin decides to go back online
 */
export interface NotAfkAction {
  notAfkAction(): void;
}
