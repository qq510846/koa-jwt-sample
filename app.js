const render = require('./lib/render');
const path = require('path');
const Router = require('koa-router');
const Koa = require('koa');
const KoaBody = require('koa-body');
const serve = require('koa-static');
const app = new Koa();
const db = require('./connect');

const posts = [];

// middleware
app.use(render);
app.use(KoaBody());

// serve static file
app.use(serve(path.join(__dirname, 'public')));

// router definitions
require('./routes')(app);

/**
 * handling 404
 */
app.use(async function pageNotFound(ctx) {
    ctx.status = 404;
    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>'
            break;
        case 'json':
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
});

if (!module.parent) app.listen(3002);