import {
	eq,
	type ColumnDataType,
	type GeneratedColumnConfig,
	type InferSelectModel,
} from "drizzle-orm";
import type {
	MySqlColumn,
	MySqlTableWithColumns,
} from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";
import type { createClient } from "redis";

export class DrizzleMySqlAdapterWithKeyDb implements Adapter {
	private mysqlDb: MySql2Database;
	private keyDb: ReturnType<typeof createClient>;

	private userTable: MySqlUserTable;

	constructor(
		mysqlDb: MySql2Database,
		keyDb: ReturnType<typeof createClient>,
		userTable: MySqlUserTable,
	) {
		this.mysqlDb = mysqlDb;
		this.keyDb = keyDb;
		this.userTable = userTable;
	}

	private sessionKey = (sessionId: string): string => {
		return `session:${sessionId}`;
	};

	private userSessionKey = (userId: UserId): string => {
		return `user_sessions:${userId}`;
	};

	private async getSession(sessionId: string): Promise<DatabaseSession | null> {
		const result = await this.keyDb.get(this.sessionKey(sessionId));
		if (!result) return null;
		return transformKeyDbSessionToLuciaSession(result);
	}

	private async getUserFromSessionId(
		sessionId: string,
	): Promise<DatabaseUser | null> {
		const session = await this.getSession(sessionId);
		if (!session) return null;
		const {
			_,
			$inferInsert,
			$inferSelect,
			getSQL,
			shouldOmitSQLParens,
			...userColumns
		} = this.userTable;
		const user = await this.mysqlDb
			.select(userColumns)
			.from(this.userTable)
			.where(eq(this.userTable.id, session.userId));
		if (user.length !== 1) return null;
		return transformMySqlUserToLuciaUser(user[0]);
	}

	public async deleteSession(sessionId: string): Promise<void> {
		const session = await this.getSession(sessionId);
		if (!session) return;
		await Promise.all([
			this.keyDb.del(this.sessionKey(sessionId)),
			this.keyDb.sRem(this.userSessionKey(session.userId), sessionId),
		]);
	}

	public async deleteUserSessions(userId: UserId): Promise<void> {
		const sessionIds = await this.keyDb.sMembers(this.userSessionKey(userId));
		await Promise.all([
			this.keyDb.del([...sessionIds.map(this.sessionKey)]),
			this.keyDb.del(this.userSessionKey(userId)),
		]);
	}

	public async getSessionAndUser(
		sessionId: string,
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		const [session, user] = await Promise.all([
			this.getSession(sessionId),
			this.getUserFromSessionId(sessionId),
		]);
		return [session, user];
	}

	public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
		const sessionIds = await this.keyDb.sMembers(this.userSessionKey(userId));
		if (sessionIds.length === 0) return [];
		return await Promise.all(
			sessionIds.map(
				async (sessionId) =>
					(await this.getSession(sessionId)) as DatabaseSession,
			),
		);
	}

	public async setSession(session: DatabaseSession): Promise<void> {
		await Promise.all([
			this.keyDb.set(this.sessionKey(session.id), JSON.stringify(session)),
			this.keyDb.sAdd(this.userSessionKey(session.userId), session.id),
		]);
	}

	public async updateSessionExpiration(
		sessionId: string,
		expiresAt: Date,
	): Promise<void> {
		const session = await this.getSession(sessionId);
		if (!session) return;
		await this.keyDb.set(
			this.sessionKey(sessionId),
			JSON.stringify({ ...session, expiresAt }),
		);
	}

	public async deleteExpiredSessions(): Promise<void> {
		const sessionIds = await this.keyDb.keys("session:*");
		const sessions = await Promise.all(
			sessionIds.map(
				async (sessionId) =>
					(await this.getSession(sessionId)) as DatabaseSession,
			),
		);
		const expiredSessions = sessions.filter(
			(session) => session.expiresAt < new Date(),
		);
		await Promise.all(
			expiredSessions.map((session) => this.deleteSession(session.id)),
		);
	}
}

export type MySqlUserTable = MySqlTableWithColumns<{
	dialect: "mysql";
	columns: {
		id: MySqlColumn<
			{
				name: string;
				tableName: string;
				dataType: ColumnDataType;
				columnType: string;
				data: UserId;
				driverParam: string | number;
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
		username: MySqlColumn<
			{
				name: string;
				tableName: string;
				dataType: ColumnDataType;
				columnType: string;
				data: string;
				driverParam: string | number;
				notNull: true;
				hasDefault: boolean;
				enumValues: string[] | undefined;
				baseColumn: string;
				isPrimaryKey: false;
				isAutoincrement: false;
				hasRuntimeDefault: false;
				generated: undefined;
			},
			object
		>;
		email: MySqlColumn<
			{
				name: string;
				tableName: string;
				dataType: ColumnDataType;
				columnType: string;
				data: string;
				driverParam: string | number;
				notNull: true;
				hasDefault: boolean;
				enumValues: string[] | undefined;
				baseColumn: string;
				isPrimaryKey: false;
				isAutoincrement: false;
				hasRuntimeDefault: false;
				generated: undefined;
			},
			object
		>;
		profileImageId: MySqlColumn<
			{
				name: string;
				tableName: string;
				dataType: ColumnDataType;
				columnType: string;
				data: number;
				driverParam: string | number;
				notNull: true;
				hasDefault: boolean;
				enumValues: string[] | undefined;
				baseColumn: string;
				isPrimaryKey: false;
				isAutoincrement: false;
				hasRuntimeDefault: false;
				generated: undefined;
			},
			object
		>;
	};
	schema: string | undefined;
	name: string;
}>;

const transformKeyDbSessionToLuciaSession = (raw: string): DatabaseSession => {
	const {
		id,
		userId,
		expiresAt: expiresAtUnix,
		...attributes
	} = JSON.parse(raw);
	return {
		userId,
		id,
		expiresAt: new Date(expiresAtUnix * 1000),
		attributes,
	};
};

const transformMySqlUserToLuciaUser = (
	raw: InferSelectModel<MySqlUserTable>,
): DatabaseUser => {
	const { id, username, email, profileImageId } = raw;
	return {
		id,
		attributes: {
			username: username,
			email: email,
			profileImageId: profileImageId,
		},
	};
};
