export default class SaveAccountError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super();

    this.name = 'SaveAccountError';
    this.message = message;
    this.code = code;
  }
}
