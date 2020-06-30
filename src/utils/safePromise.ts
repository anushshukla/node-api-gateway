export default (promise: Promise<any>) =>
    promise
        .then((response: any) => [null, response])
        .catch((error: any) => [error])