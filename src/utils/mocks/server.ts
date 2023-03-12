import { DefaultBodyType, PathParams, ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();

const defaultResolver: ResponseResolver<RestRequest<DefaultBodyType, PathParams>, RestContext, any> = (
    req,
    res,
    ctx
) => {
    console.warn(`Unhandled request (${req.url}) in "${expect.getState().currentTestName}"`, JSON.stringify(req));
    return res(ctx.status(500));
};

export const defaultHandlers = [
    rest.get('*', defaultResolver),
    rest.post('*', defaultResolver),
    rest.patch('*', defaultResolver),
    rest.put('*', defaultResolver),
    rest.delete('*', defaultResolver),
];

server.use(...defaultHandlers);

export default server;
