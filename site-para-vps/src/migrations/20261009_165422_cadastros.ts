import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_destinations" AS ENUM('brasil', 'portugal-fatima', 'italia-vaticano', 'franca-lourdes', 'espanha-marianos', 'mexico-guadalupe', 'egito-terra-santa', 'indefinido');
  CREATE TYPE "public"."enum_leads_consents_purpose" AS ENUM('cadastro-contato', 'comunicacoes');
  CREATE TYPE "public"."enum_leads_type" AS ENUM('PADRE', 'AGENCIA', 'PEREGRINO');
  CREATE TYPE "public"."enum_leads_state" AS ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('novo', 'em-analise', 'contato-iniciado', 'em-negociacao', 'convertido', 'encerrado');
  CREATE TYPE "public"."enum_leads_partnership_status" AS ENUM('nao-se-aplica', 'pendente', 'em-avaliacao', 'aprovada', 'nao-aprovada');
  CREATE TYPE "public"."enum_leads_source" AS ENUM('lp-padres', 'lp-agencias', 'lp-peregrinos', 'manual');
  CREATE TYPE "public"."enum_leads_notification_status" AS ENUM('enviado', 'pendente', 'falhou');
  CREATE TYPE "public"."enum_leads_confirmation_status" AS ENUM('nao-enviada', 'enviada', 'falhou');
  CREATE TYPE "public"."enum_priest_profiles_destinations" AS ENUM('brasil', 'portugal-fatima', 'italia-vaticano', 'franca-lourdes', 'espanha-marianos', 'mexico-guadalupe', 'egito-terra-santa', 'indefinido');
  CREATE TYPE "public"."enum_priest_profiles_main_interest" AS ENUM('organizar', 'acompanhar', 'conhecer-destinos', 'parcerias', 'outro');
  CREATE TYPE "public"."enum_priest_profiles_has_organized" AS ENUM('sim', 'nao');
  CREATE TYPE "public"."enum_priest_profiles_group_size" AS ENUM('ate-15', '16-30', '31-50', 'acima-50', 'nao-sei');
  CREATE TYPE "public"."enum_priest_profiles_travel_period" AS ENUM('ate-3-meses', '3-6-meses', '6-12-meses', 'mais-de-1-ano', 'pesquisando');
  CREATE TYPE "public"."enum_agency_profiles_destinations" AS ENUM('brasil', 'portugal-fatima', 'italia-vaticano', 'franca-lourdes', 'espanha-marianos', 'mexico-guadalupe', 'egito-terra-santa', 'indefinido');
  CREATE TYPE "public"."enum_agency_profiles_profile" AS ENUM('agencia', 'operadora', 'consultor', 'outro');
  CREATE TYPE "public"."enum_agency_profiles_interest" AS ENUM('comercializar', 'grupos-exclusivos', 'condicoes', 'turismo-religioso', 'outra');
  CREATE TYPE "public"."enum_agency_profiles_tenure" AS ENUM('menos-1', '1-3', '4-10', 'mais-10');
  CREATE TYPE "public"."enum_agency_profiles_works_with_religious" AS ENUM('sim', 'nao');
  CREATE TYPE "public"."enum_agency_profiles_volume" AS ENUM('ate-10', '11-50', '51-200', 'acima-200');
  CREATE TYPE "public"."enum_agency_profiles_cnpj_verification" AS ENUM('nao-verificado', 'verificado', 'divergente');
  CREATE TYPE "public"."enum_agency_profiles_cadastur_verification" AS ENUM('nao-verificado', 'verificado', 'divergente');
  CREATE TYPE "public"."enum_pilgrim_profiles_destinations" AS ENUM('brasil', 'portugal-fatima', 'italia-vaticano', 'franca-lourdes', 'espanha-marianos', 'mexico-guadalupe', 'egito-terra-santa', 'indefinido');
  CREATE TYPE "public"."enum_pilgrim_profiles_travel_period" AS ENUM('ate-3-meses', '3-6-meses', '6-12-meses', 'mais-de-1-ano', 'pesquisando');
  CREATE TYPE "public"."enum_pilgrim_profiles_party_size" AS ENUM('1', '2', '3-4', '5-9', '10+');
  CREATE TYPE "public"."enum_pilgrim_profiles_previous_pilgrimage" AS ENUM('sim', 'nao');
  CREATE TYPE "public"."enum_pilgrim_profiles_group_with_community" AS ENUM('sim', 'nao', 'talvez');
  ALTER TYPE "public"."enum_users_roles" ADD VALUE 'comercial';
  CREATE TABLE "leads_destinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_leads_destinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "leads_consents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"purpose" "enum_leads_consents_purpose" NOT NULL,
  	"granted" boolean,
  	"granted_at" timestamp(3) with time zone,
  	"notice_version" varchar,
  	"withdrawn_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_leads_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"city" varchar,
  	"state" "enum_leads_state",
  	"status" "enum_leads_status" DEFAULT 'novo' NOT NULL,
  	"partnership_status" "enum_leads_partnership_status" DEFAULT 'nao-se-aplica',
  	"assignee_id" integer,
  	"internal_notes" varchar,
  	"priest_profile_id" integer,
  	"agency_profile_id" integer,
  	"pilgrim_profile_id" integer,
  	"source" "enum_leads_source" DEFAULT 'manual' NOT NULL,
  	"entry_point" varchar,
  	"source_page" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"marketing_consent" boolean DEFAULT false,
  	"retain_until" timestamp(3) with time zone,
  	"anonymized_at" timestamp(3) with time zone,
  	"unsubscribe_token" varchar,
  	"possible_duplicate" boolean DEFAULT false,
  	"duplicate_of_id" integer,
  	"email_key" varchar,
  	"notification_status" "enum_leads_notification_status" DEFAULT 'pendente',
  	"confirmation_status" "enum_leads_confirmation_status" DEFAULT 'nao-enviada',
  	"delivery_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "priest_profiles_destinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_priest_profiles_destinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "priest_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"display_name" varchar,
  	"diocese" varchar NOT NULL,
  	"parish" varchar NOT NULL,
  	"ministry" varchar NOT NULL,
  	"main_interest" "enum_priest_profiles_main_interest" NOT NULL,
  	"has_organized" "enum_priest_profiles_has_organized",
  	"group_size" "enum_priest_profiles_group_size",
  	"travel_period" "enum_priest_profiles_travel_period",
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agency_profiles_destinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_agency_profiles_destinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "agency_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"legal_name" varchar NOT NULL,
  	"trade_name" varchar NOT NULL,
  	"cnpj" varchar,
  	"contact_role" varchar NOT NULL,
  	"profile" "enum_agency_profiles_profile" NOT NULL,
  	"interest" "enum_agency_profiles_interest" NOT NULL,
  	"cadastur" varchar,
  	"website" varchar,
  	"instagram" varchar,
  	"tenure" "enum_agency_profiles_tenure",
  	"works_with_religious" "enum_agency_profiles_works_with_religious",
  	"volume" "enum_agency_profiles_volume",
  	"message" varchar,
  	"cnpj_verification" "enum_agency_profiles_cnpj_verification" DEFAULT 'nao-verificado',
  	"cadastur_verification" "enum_agency_profiles_cadastur_verification" DEFAULT 'nao-verificado',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pilgrim_profiles_destinations" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pilgrim_profiles_destinations",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pilgrim_profiles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"travel_period" "enum_pilgrim_profiles_travel_period" NOT NULL,
  	"boarding_city" varchar,
  	"party_size" "enum_pilgrim_profiles_party_size",
  	"previous_pilgrimage" "enum_pilgrim_profiles_previous_pilgrimage",
  	"group_with_community" "enum_pilgrim_profiles_group_with_community",
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "priest_profiles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "agency_profiles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pilgrim_profiles_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "lead_confirmation_email" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "lead_retention_months" numeric DEFAULT 24;
  ALTER TABLE "leads_destinations" ADD CONSTRAINT "leads_destinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_consents" ADD CONSTRAINT "leads_consents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_priest_profile_id_priest_profiles_id_fk" FOREIGN KEY ("priest_profile_id") REFERENCES "public"."priest_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_agency_profile_id_agency_profiles_id_fk" FOREIGN KEY ("agency_profile_id") REFERENCES "public"."agency_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_pilgrim_profile_id_pilgrim_profiles_id_fk" FOREIGN KEY ("pilgrim_profile_id") REFERENCES "public"."pilgrim_profiles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_duplicate_of_id_leads_id_fk" FOREIGN KEY ("duplicate_of_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "priest_profiles_destinations" ADD CONSTRAINT "priest_profiles_destinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."priest_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "priest_profiles" ADD CONSTRAINT "priest_profiles_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "agency_profiles_destinations" ADD CONSTRAINT "agency_profiles_destinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."agency_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "agency_profiles" ADD CONSTRAINT "agency_profiles_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pilgrim_profiles_destinations" ADD CONSTRAINT "pilgrim_profiles_destinations_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pilgrim_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pilgrim_profiles" ADD CONSTRAINT "pilgrim_profiles_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leads_destinations_order_idx" ON "leads_destinations" USING btree ("order");
  CREATE INDEX "leads_destinations_parent_idx" ON "leads_destinations" USING btree ("parent_id");
  CREATE INDEX "leads_consents_order_idx" ON "leads_consents" USING btree ("_order");
  CREATE INDEX "leads_consents_parent_id_idx" ON "leads_consents" USING btree ("_parent_id");
  CREATE INDEX "leads_type_idx" ON "leads" USING btree ("type");
  CREATE INDEX "leads_name_idx" ON "leads" USING btree ("name");
  CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");
  CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");
  CREATE INDEX "leads_city_idx" ON "leads" USING btree ("city");
  CREATE INDEX "leads_state_idx" ON "leads" USING btree ("state");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_partnership_status_idx" ON "leads" USING btree ("partnership_status");
  CREATE INDEX "leads_assignee_idx" ON "leads" USING btree ("assignee_id");
  CREATE INDEX "leads_priest_profile_idx" ON "leads" USING btree ("priest_profile_id");
  CREATE INDEX "leads_agency_profile_idx" ON "leads" USING btree ("agency_profile_id");
  CREATE INDEX "leads_pilgrim_profile_idx" ON "leads" USING btree ("pilgrim_profile_id");
  CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");
  CREATE INDEX "leads_utm_utm_campaign_idx" ON "leads" USING btree ("utm_campaign");
  CREATE INDEX "leads_marketing_consent_idx" ON "leads" USING btree ("marketing_consent");
  CREATE INDEX "leads_retain_until_idx" ON "leads" USING btree ("retain_until");
  CREATE INDEX "leads_unsubscribe_token_idx" ON "leads" USING btree ("unsubscribe_token");
  CREATE INDEX "leads_possible_duplicate_idx" ON "leads" USING btree ("possible_duplicate");
  CREATE INDEX "leads_duplicate_of_idx" ON "leads" USING btree ("duplicate_of_id");
  CREATE INDEX "leads_email_key_idx" ON "leads" USING btree ("email_key");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "priest_profiles_destinations_order_idx" ON "priest_profiles_destinations" USING btree ("order");
  CREATE INDEX "priest_profiles_destinations_parent_idx" ON "priest_profiles_destinations" USING btree ("parent_id");
  CREATE INDEX "priest_profiles_lead_idx" ON "priest_profiles" USING btree ("lead_id");
  CREATE INDEX "priest_profiles_updated_at_idx" ON "priest_profiles" USING btree ("updated_at");
  CREATE INDEX "priest_profiles_created_at_idx" ON "priest_profiles" USING btree ("created_at");
  CREATE INDEX "agency_profiles_destinations_order_idx" ON "agency_profiles_destinations" USING btree ("order");
  CREATE INDEX "agency_profiles_destinations_parent_idx" ON "agency_profiles_destinations" USING btree ("parent_id");
  CREATE INDEX "agency_profiles_lead_idx" ON "agency_profiles" USING btree ("lead_id");
  CREATE INDEX "agency_profiles_cnpj_idx" ON "agency_profiles" USING btree ("cnpj");
  CREATE INDEX "agency_profiles_updated_at_idx" ON "agency_profiles" USING btree ("updated_at");
  CREATE INDEX "agency_profiles_created_at_idx" ON "agency_profiles" USING btree ("created_at");
  CREATE INDEX "pilgrim_profiles_destinations_order_idx" ON "pilgrim_profiles_destinations" USING btree ("order");
  CREATE INDEX "pilgrim_profiles_destinations_parent_idx" ON "pilgrim_profiles_destinations" USING btree ("parent_id");
  CREATE INDEX "pilgrim_profiles_lead_idx" ON "pilgrim_profiles" USING btree ("lead_id");
  CREATE INDEX "pilgrim_profiles_updated_at_idx" ON "pilgrim_profiles" USING btree ("updated_at");
  CREATE INDEX "pilgrim_profiles_created_at_idx" ON "pilgrim_profiles" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_priest_profiles_fk" FOREIGN KEY ("priest_profiles_id") REFERENCES "public"."priest_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agency_profiles_fk" FOREIGN KEY ("agency_profiles_id") REFERENCES "public"."agency_profiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pilgrim_profiles_fk" FOREIGN KEY ("pilgrim_profiles_id") REFERENCES "public"."pilgrim_profiles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_priest_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("priest_profiles_id");
  CREATE INDEX "payload_locked_documents_rels_agency_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("agency_profiles_id");
  CREATE INDEX "payload_locked_documents_rels_pilgrim_profiles_id_idx" ON "payload_locked_documents_rels" USING btree ("pilgrim_profiles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads_destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_consents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "priest_profiles_destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "priest_profiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agency_profiles_destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agency_profiles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pilgrim_profiles_destinations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pilgrim_profiles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leads_destinations" CASCADE;
  DROP TABLE "leads_consents" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "priest_profiles_destinations" CASCADE;
  DROP TABLE "priest_profiles" CASCADE;
  DROP TABLE "agency_profiles_destinations" CASCADE;
  DROP TABLE "agency_profiles" CASCADE;
  DROP TABLE "pilgrim_profiles_destinations" CASCADE;
  DROP TABLE "pilgrim_profiles" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_priest_profiles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_agency_profiles_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pilgrim_profiles_fk";
  
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_roles";
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  ALTER TABLE "users_roles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_roles" USING "value"::"public"."enum_users_roles";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_priest_profiles_id_idx";
  DROP INDEX "payload_locked_documents_rels_agency_profiles_id_idx";
  DROP INDEX "payload_locked_documents_rels_pilgrim_profiles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "priest_profiles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "agency_profiles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pilgrim_profiles_id";
  ALTER TABLE "site_settings" DROP COLUMN "lead_confirmation_email";
  ALTER TABLE "site_settings" DROP COLUMN "lead_retention_months";
  DROP TYPE "public"."enum_leads_destinations";
  DROP TYPE "public"."enum_leads_consents_purpose";
  DROP TYPE "public"."enum_leads_type";
  DROP TYPE "public"."enum_leads_state";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_partnership_status";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_notification_status";
  DROP TYPE "public"."enum_leads_confirmation_status";
  DROP TYPE "public"."enum_priest_profiles_destinations";
  DROP TYPE "public"."enum_priest_profiles_main_interest";
  DROP TYPE "public"."enum_priest_profiles_has_organized";
  DROP TYPE "public"."enum_priest_profiles_group_size";
  DROP TYPE "public"."enum_priest_profiles_travel_period";
  DROP TYPE "public"."enum_agency_profiles_destinations";
  DROP TYPE "public"."enum_agency_profiles_profile";
  DROP TYPE "public"."enum_agency_profiles_interest";
  DROP TYPE "public"."enum_agency_profiles_tenure";
  DROP TYPE "public"."enum_agency_profiles_works_with_religious";
  DROP TYPE "public"."enum_agency_profiles_volume";
  DROP TYPE "public"."enum_agency_profiles_cnpj_verification";
  DROP TYPE "public"."enum_agency_profiles_cadastur_verification";
  DROP TYPE "public"."enum_pilgrim_profiles_destinations";
  DROP TYPE "public"."enum_pilgrim_profiles_travel_period";
  DROP TYPE "public"."enum_pilgrim_profiles_party_size";
  DROP TYPE "public"."enum_pilgrim_profiles_previous_pilgrimage";
  DROP TYPE "public"."enum_pilgrim_profiles_group_with_community";`)
}
