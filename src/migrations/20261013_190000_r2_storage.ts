import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cloudflare R2 S3 adapter adds object-key and prefix metadata on uploads.
 * Previous production migrations predate the storage adapter.
 * This is additive: existing media, documents, admin accounts and trips remain untouched.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
    ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "prefix" varchar;
    ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
    ALTER TABLE "documents" DROP COLUMN IF EXISTS "_objectkey";
    ALTER TABLE "documents" DROP COLUMN IF EXISTS "prefix";
  `)
}
