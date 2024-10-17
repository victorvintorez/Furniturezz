import { eq, type ColumnDataType, type GeneratedColumnConfig, type InferSelectModel } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { SQLiteColumn, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import type Redis from "ioredis";
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";

export class DrizzleSqliteAdapterWithKeyDb implements Adapter {
	private sqliteDb: BunSQLiteDatabase;
    private keyDb: Redis;
    
    private userTable: SQLiteUserTable;

    constructor(
        sqliteDb: BunSQLiteDatabase,
        keyDb: Redis,
        userTable: SQLiteUserTable,
    ) {
        this.sqliteDb = sqliteDb;
        this.keyDb = keyDb;
        this.userTable = userTable;
    }

    private sessionKey = (sessionId: string): string => {
        return `session:${sessionId}`;
    }

    private userSessionKey = (userId: UserId): string => {
        return `user_sessions:${userId}`;
    }

    private async getSession(sessionId: string): Promise<DatabaseSession | null> {
        const result = await this.keyDb.get(this.sessionKey(sessionId));
        if (!result) return null;
        return transformKeyDbSessionToLuciaSession(result);
    }

    private async getUserFromSessionId(sessionId: string): Promise<DatabaseUser | null> {
        const session = await this.getSession(sessionId);
        if (!session) return null;
        const { _, $inferInsert, $inferSelect, getSQL, shouldOmitSQLParens, ...userColumns } = this.userTable;
        const user = await this.sqliteDb.select(userColumns).from(this.userTable).where(eq(this.userTable.id, session.userId));
        if(user.length !== 1) return null;
        return transformSqliteUserToLuciaUser(user[0]);
    }

    public async deleteSession(sessionId: string): Promise<void> {
        const session = await this.getSession(sessionId);
        if (!session) return;
        await Promise.all([
            this.keyDb.del(this.sessionKey(sessionId)),
            this.keyDb.srem(this.userSessionKey(session.userId), sessionId),
        ])
    }

    public async deleteUserSessions(userId: UserId): Promise<void> {
        const sessionIds = await this.keyDb.smembers(this.userSessionKey(userId));
        await Promise.all([
            this.keyDb.del(...sessionIds.map(this.sessionKey)),
            this.keyDb.del(this.userSessionKey(userId)),
        ]);
    }

    public async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const [ session, user ] = await Promise.all([
            this.getSession(sessionId),
            this.getUserFromSessionId(sessionId),
        ]);
        return [ session, user ];
    }

    public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
        const sessionIds = await this.keyDb.smembers(this.userSessionKey(userId));
        if (sessionIds.length === 0) return [];
        return await Promise.all(sessionIds.map(async (sessionId) => await this.getSession(sessionId) as DatabaseSession));
    }

    public async setSession(session: DatabaseSession): Promise<void> {
        await Promise.all([
            this.keyDb.set(this.sessionKey(session.id), JSON.stringify(session)),
            this.keyDb.sadd(this.userSessionKey(session.userId), session.id),
        ]);
    }

    public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
        const session = await this.getSession(sessionId);
        if (!session) return;
        await this.keyDb.set(this.sessionKey(sessionId), JSON.stringify({ ...session, expiresAt }));
    }

    public async deleteExpiredSessions(): Promise<void> {
        const sessionIds = await this.keyDb.keys("session:*");
        const sessions = await Promise.all(sessionIds.map(async (sessionId) => await this.getSession(sessionId) as DatabaseSession));
        const expiredSessions = sessions.filter((session) => session.expiresAt < new Date());
        await Promise.all(expiredSessions.map((session) => this.deleteSession(session.id)));
    }
}


export type SQLiteUserTable = SQLiteTableWithColumns<{
    dialect: "sqlite";
    columns: {
        id: SQLiteColumn<{
            name: string;
            tableName: string;
            dataType: ColumnDataType;
            columnType: string;
            data: UserId;
            driverParam: number;
            notNull: true;
            hasDefault: boolean;
            enumValues: string[] | undefined;
            baseColumn: string;
            isPrimaryKey: boolean;
            isAutoincrement: boolean;
            hasRuntimeDefault: boolean;
            generated: GeneratedColumnConfig<unknown> | undefined;
        },
        object
        >;
    };
    schema: string | undefined;
    name: string;
}>;

const transformKeyDbSessionToLuciaSession = (raw: string): DatabaseSession => {
    const { id, userId, expiresAt: expiresAtUnix, ...attributes } = JSON.parse(raw);
    return {
        userId,
        id,
        expiresAt: new Date(expiresAtUnix * 1000),
        attributes
    }
}

const transformSqliteUserToLuciaUser = (raw: InferSelectModel<SQLiteUserTable>): DatabaseUser => {
    const { id, ...attributes } = raw;
    return {
        id,
        attributes
    }
}