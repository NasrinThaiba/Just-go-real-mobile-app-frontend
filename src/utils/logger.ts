const PREFIX =
  '[Just Go Real]';

export const logger = {
  info(
    message: string,
    ...data: unknown[]
  ) {
    if (__DEV__) {
      console.log(
        PREFIX,
        message,
        ...data,
      );
    }
  },

  warn(
    message: string,
    ...data: unknown[]
  ) {
    if (__DEV__) {
      console.warn(
        PREFIX,
        message,
        ...data,
      );
    }
  },

  error(
    message: string,
    error?: unknown,
  ) {
    console.error(
      PREFIX,
      message,
      error,
    );
  },

  debug(
    message: string,
    ...data: unknown[]
  ) {
    if (__DEV__) {
      console.debug(
        PREFIX,
        message,
        ...data,
      );
    }
  },
};