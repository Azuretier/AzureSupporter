import * as fs from 'fs/promises';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data.json');

// データの型定義
interface DBStructure {
    guilds: {
        [guildId: string]: {
            users: {
                [userId: string]: {
                    xp: number;
                    level: number;
                    username: string;
                    lastUpdate: string;
                }
            };
            config: {
                voice?: { generatorChannelId: string; categoryId: string };
                selectRole?: { roles: any[] };
            };
        };
    };
    activeVoiceChannels: {
        [channelId: string]: { ownerId: string; guildId: string };
    };
}

class JSONDatabase {
    getTranslatorConfig(arg0: string) {
        throw new Error('Method not implemented.');
    }
    private data: DBStructure | null = null;

    // ファイルからデータを読み込む
    private async load() {
        try {
            const raw = await fs.readFile(DATA_PATH, 'utf-8');
            this.data = JSON.parse(raw);
        } catch (e) {
            // ファイルがない場合は初期化
            this.data = { guilds: {}, activeVoiceChannels: {} };
            await this.save();
        }
    }

    // ファイルにデータを保存する
    private async save() {
        if (!this.data) return;
        await fs.writeFile(DATA_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    }

    /** ランク機能用 */
    async updateUserXP(guildId: string, userId: string, xpToAdd: number, username: string) {
        await this.load();
        const guilds = this.data!.guilds;

        // 初期化
        if (!guilds[guildId]) guilds[guildId] = { users: {}, config: {} };
        if (!guilds[guildId].users[userId]) {
            guilds[guildId].users[userId] = { xp: 0, level: 0, username, lastUpdate: "" };
        }

        const user = guilds[guildId].users[userId];
        user.xp += xpToAdd;
        user.username = username;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp)); // レベル計算
        user.lastUpdate = new Date().toISOString();

        await this.save();
        return { xp: user.xp, level: user.level };
    }

    /** VC管理用 */
    async getVoiceConfig(guildId: string) {
        await this.load();
        return this.data!.guilds[guildId]?.config?.voice || null;
    }

    async registerActiveVC(channelId: string, ownerId: string, guildId: string) {
        await this.load();
        this.data!.activeVoiceChannels[channelId] = { ownerId, guildId };
        await this.save();
    }

    async removeActiveVC(channelId: string) {
        await this.load();
        delete this.data!.activeVoiceChannels[channelId];
        await this.save();
    }

    async getVCOwner(channelId: string) {
        await this.load();
        return this.data!.activeVoiceChannels[channelId]?.ownerId || null;
    }

    /** ロールパネル用 */
    async getRolePanelConfig(guildId: string) {
        await this.load();
        return this.data!.guilds[guildId]?.config?.selectRole?.roles || [];
    }
}

export const dbService = new JSONDatabase();