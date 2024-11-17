const db_file_path = Deno.env.get("DB_FILE_PATH") ?? "database"
const conn = await Deno.openKv(`${db_file_path}/db1.db`)

if (!conn) {
    throw new Error("Could not connect to KV store")
}

class DenoKV {
    static async get(key: string) {
        return await conn.get([key])
    }

    static async set(key: string, value: string) {
        return await conn.set([key], value)
    }
}

export default DenoKV
