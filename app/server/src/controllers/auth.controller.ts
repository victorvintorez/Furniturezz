import { Elysia } from 'elysia';

export const AuthController = new Elysia({ prefix: '/auth'})
    .post('/login', async (ctx) => {
        return ctx.redirect('/');
    })