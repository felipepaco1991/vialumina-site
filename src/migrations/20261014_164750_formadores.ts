import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leader_profiles_destinations" AS ENUM('brasil', 'portugal-fatima', 'italia-vaticano', 'franca-lourdes', 'espanha-marianos', 'mexico-guadalupe', 'egito-terra-santa', 'indefinido');
  CREATE TYPE "public"."enum_leader_profiles_role" AS ENUM('pastoral', 'formacao', 'comunicacao', 'comunidade', 'outro');
  CREATE TYPE "public"."enum_leader_profiles_reach" AS ENUM('ate-50', '51-200', '201-1000', 'acima-1000');
  CREATE TYPE "public"."enum_leader_profiles_has_organized" AS ENUM('sim', 'nao');
  CREATE TYPE "public"."enum_leader_profiles_has_spiritual_guide" AS ENUM('sim', 'nao');
  CREATE TYPE "public"."enum_leader_profiles_group_size" AS ENUM('ate-15', '16-30', '31-50', 'acima-50', 'nao-sei');
  CREATE TYPE "public"."enum_leader_profiles_travel_period" AS ENUM('ate-3-meses', '3-6-meses', '6-12-meses', 'mais-de-1-ano', 'pesquisando');
  ALTER TYPE "public"."enum_leads_type" ADD VALUE 'FORMADOR' BEFORE 'PEREGRINO';
  ALTER TYPE "public"."enum_leads_source" ADD VALUE 'lp-formadores' BEFORE 'lp-peregrinos';
  CREATE TABLE "leader_profiles_destinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_leader_profiles_destinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "leader_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"community" varchar NOT NULL,
  	"role" "enum_leader_profiles_role" NOT NULL,
  	"role_detail" varchar,
  	"instagram" varchar,
  	"reach" "enum_leader_profiles_reach",
  	"has_organized" "enum_leader_profiles_has_organized",
  	"has_spiritual_guide" "enum_leader_profiles_has_spiritual_guide",
  	"group_size" "enum_leader_profiles_group_size",
  	"travel_period" "enum_leader_profiles_travel_period",
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  UPDATE "site_settings" SET "hours" = 'Seg. a Sex. 8h - 18h' WHERE "hours" = 'Seg. a Sáb. 8h - 18h';
  ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT 'media';
  ALTER TABLE "documents" ALTER COLUMN "prefix" SET DEFAULT 'documents';
  ALTER TABLE "site_settings" ALTER COLUMN "hours" SET DEFAULT 'Seg. a Sex. 8h - 18h';
  ALTER TABLE "leads" ADD COLUMN "leader_profile_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leader_profiles_id" integer;
  ALTER TABLE "leader_profiles_destinations" ADD CONSTRAINT "leader_profiles_destinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leader_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leader_profiles" ADD CONSTRAINT "leader_profiles_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leader_profiles_destinations_order_idx" ON "leader_profiles_destinations" USING btree ("order");
  CREATE INDEX "leader_profiles_destinations_parent_idx" ON "leader_profiles_destinations" USING btree ("parent_id");
  CREATE INDEX "leader_profiles_lead_idx" ON "leader_profiles" USING btree ("lead_id");
  CREATE INDEX "leader_profiles_updated_at_idx" ON "leader_profiles" USING btree ("updated_at");
  CREATE INDEX "leader_profiles_created_at_idx" ON "leader_profiles" USING btree ("created_at");
  ALTER TABLE "leads" ADD CONSTRAINT "leads_leader_profile_id_leader_profiles_id_fk" FOREIGN KEY ("leader_profile_id") REFERENCES "public"."leader_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leader_profiles_fk" FOREIGN KEY ("leader_profiles_id") REFERENCES "public"."leader_profiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "leads_leader_profile_idx" ON "leads" USING btree ("leader_profile_id");
  CREATE INDEX "payload_locked_documents_rels_leader_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("leader_profiles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leader_profiles_destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leader_profiles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leader_profiles_destinations" CASCADE;
  DROP TABLE "leader_profiles" CASCADE;
  ALTER TABLE "leads" DROP CONSTRAINT "leads_leader_profile_id_leader_profiles_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leader_profiles_fk";
  
  ALTER TABLE "leads" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_type";
  CREATE TYPE "public"."enum_leads_type" AS ENUM('PADRE', 'AGENCIA', 'PEREGRINO');
  ALTER TABLE "leads" ALTER COLUMN "type" SET DATA TYPE "public"."enum_leads_type" USING "type"::"public"."enum_leads_type";
  ALTER TABLE "leads" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "leads" ALTER COLUMN "source" SET DEFAULT 'manual'::text;
  DROP TYPE "public"."enum_leads_source";
  CREATE TYPE "public"."enum_leads_source" AS ENUM('lp-padres', 'lp-agencias', 'lp-peregrinos', 'manual');
  ALTER TABLE "leads" ALTER COLUMN "source" SET DEFAULT 'manual'::"public"."enum_leads_source";
  ALTER TABLE "leads" ALTER COLUMN "source" SET DATA TYPE "public"."enum_leads_source" USING "source"::"public"."enum_leads_source";
  DROP INDEX "leads_leader_profile_idx";
  DROP INDEX "payload_locked_documents_rels_leader_profiles_id_idx";
  ALTER TABLE "media" ALTER COLUMN "prefix" DROP DEFAULT;
  ALTER TABLE "documents" ALTER COLUMN "prefix" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "hours" SET DEFAULT 'Seg. a Sáb. 8h - 18h';
  ALTER TABLE "leads" DROP COLUMN "leader_profile_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leader_profiles_id";
  DROP TYPE "public"."enum_leader_profiles_destinations";
  DROP TYPE "public"."enum_leader_profiles_role";
  DROP TYPE "public"."enum_leader_profiles_reach";
  DROP TYPE "public"."enum_leader_profiles_has_organized";
  DROP TYPE "public"."enum_leader_profiles_has_spiritual_guide";
  DROP TYPE "public"."enum_leader_profiles_group_size";
  DROP TYPE "public"."enum_leader_profiles_travel_period";`)
}
