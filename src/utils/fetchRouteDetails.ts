interface Middleware {
    middlewareName: string
}

interface RoutePath {
  routePath: string;
  middlewares: Array<Middleware>;
}

export default (routePath: string) : RoutePath => {
    const query = `
      SELECT *
      FROM \`routes\`
      WHERE
        routePath = ?
    `;
    const middlewares: Array<Middleware> = [];
    // @ToDo execute the query
    return {
        routePath,
        middlewares
    }
}