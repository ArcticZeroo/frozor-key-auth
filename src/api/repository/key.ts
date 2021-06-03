import { ApiKey } from '@prisma/client';
import * as crypto from 'crypto';
import { client } from './client';
import { ICreateApiKeyParams, IFindApiKeyParams } from '@arcticzeroo/frozor-auth-common';

export abstract class ApiKeyRepository {
    private static async _hashKey(key: string): Promise<string> {
        return crypto.createHash('sha256')
            .update(key)
            .digest('hex');
    }

    static async insert({ key: rawKey, service, permissions = 0 }: ICreateApiKeyParams): Promise<ApiKey> {
        if (permissions < 0) {
            throw new Error('Key cannot have negative permissions');
        }

        if (permissions > (2 ** 30)) {
            throw new Error('Permissions is too large, bitwise operations will fail');
        }

        const key = await ApiKeyRepository._hashKey(rawKey);

        return client.apiKey.create({
            data: {
                key,
                service,
                permissions
            }
        });
    }

    static async find({ key: rawKey, service }: IFindApiKeyParams) {
        const key = await ApiKeyRepository._hashKey(rawKey);

        return client.apiKey.findFirst({
            where: {
                key,
                service
            }
        });
    }
}