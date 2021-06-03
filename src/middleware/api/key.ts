import Router, { Middleware } from '@koa/router';
import { generateKey } from '../../api/crypto/keygen';
import { ApiKeyRepository } from '../../api/repository/key';
import { adminPermissions } from '../../constants/permissions';
import { serviceName } from '../../constants/services';
import { RouterMiddleware } from '../../models/middleware';
import { hasPermission } from '../../util/bitwise';

const validateAdminKey = (requiredPermissions: number): Middleware => async (ctx, next) => {
    const queryParams = ctx.query;

    const adminKey = queryParams['adminKey'];

    if (!adminKey || typeof adminKey !== 'string') {
        ctx.status = 401;
        ctx.body = 'Missing admin key.';
        return;
    }

    const adminApiKey = await ApiKeyRepository.find({
        key:     adminKey,
        service: serviceName.admin
    });

    if (adminApiKey == null) {
        ctx.status = 401;
        ctx.body = 'Invalid admin key.';
        return;
    }

    if (!hasPermission(requiredPermissions, adminApiKey.permissions)) {
        ctx.status = 403;
        ctx.body = 'Insufficient permissions to perform operation.';
        return;
    }

    return next();
};

export const registerKeyRoutes: RouterMiddleware = app => {
    const router = new Router();

    router.post('/', validateAdminKey(adminPermissions.createKeys), async (ctx) => {
        const queryParams = ctx.query;

        const service = queryParams['service'];
        const permissionsRaw = Number(queryParams['permissions']);

        if (!service || typeof service !== 'string' || !Object.values(serviceName).includes(service)) {
            ctx.status = 400;
            ctx.body = 'Service is missing or invalid.';
            return;
        }

        // It's OK to have zero permissions on a key
        const permissions = Number.isNaN(permissionsRaw)
                            ? 0
                            : permissionsRaw;

        const key = generateKey();

        await ApiKeyRepository.insert({
            key,
            service,
            permissions
        });

        ctx.body = {
            key
        };
    });

    router.get('/:key', validateAdminKey(adminPermissions.viewKeys), async (ctx) => {
        const key = ctx.params['key'];

        if (!key) {
            ctx.status = 400;
            ctx.body = 'Missing key.';
            return;
        }

        const apiKey = await ApiKeyRepository.find({ key });

        if (apiKey == null) {
            ctx.status = 404;
            ctx.body = 'Key does not exist.';
            return;
        }

        ctx.body = apiKey;
    });

    app.use('/key', router.routes(), router.allowedMethods());
};