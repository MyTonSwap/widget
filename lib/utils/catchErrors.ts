/* eslint-disable @typescript-eslint/no-explicit-any */
type Success<T> = { data: T; error: null };
type Failure<E = Error> = { data: null; error: E };
type Result<T, E = Error> = Success<T> | Failure<E>;

export default function catchError<T, E = Error>(
    fn: (...args: any[]) => Promise<T> | T,
    ...args: any[]
): Promise<Result<T, E>> {
    try {
        const result = fn(...args);
        if (result instanceof Promise) {
            return result
                .then((data: T) => ({ data, error: null } as Success<T>))
                .catch((error: E) => ({ data: null, error } as Failure<E>));
        }
        return Promise.resolve({ data: result, error: null } as Success<T>);
    } catch (error) {
        return Promise.resolve({ data: null, error: error as E } as Failure<E>);
    }
}
