import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";

export const handlers = [
    http.get('http://localhost:9000/test', async () => {
        await delay(100)
        return HttpResponse.json('API is working properly!')
    })
]

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
