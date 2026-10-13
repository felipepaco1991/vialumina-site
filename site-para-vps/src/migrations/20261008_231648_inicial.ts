import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_trips_regions" AS ENUM('brasil', 'europa', 'america-do-norte', 'oriente-medio-africa');
  CREATE TYPE "public"."enum_trips_status" AS ENUM('rascunho', 'publicado', 'sob-consulta', 'esgotado', 'encerrado');
  CREATE TYPE "public"."enum_trips_link_target" AS ENUM('legacy', 'internal');
  CREATE TYPE "public"."enum_trips_pricing_currency" AS ENUM('BRL', 'USD', 'EUR');
  CREATE TYPE "public"."enum__trips_v_version_regions" AS ENUM('brasil', 'europa', 'america-do-norte', 'oriente-medio-africa');
  CREATE TYPE "public"."enum__trips_v_version_status" AS ENUM('rascunho', 'publicado', 'sob-consulta', 'esgotado', 'encerrado');
  CREATE TYPE "public"."enum__trips_v_version_link_target" AS ENUM('legacy', 'internal');
  CREATE TYPE "public"."enum__trips_v_version_pricing_currency" AS ENUM('BRL', 'USD', 'EUR');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('novo', 'em-atendimento', 'concluido');
  CREATE TYPE "public"."enum_inquiries_email_delivery" AS ENUM('enviado', 'pendente', 'falhou');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TABLE "trips_regions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_trips_regions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "trips_guides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"guide_id" integer NOT NULL,
  	"role" varchar NOT NULL
  );
  
  CREATE TABLE "trips_guidance_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "trips_highlights_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "trips_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"place" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "trips_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" numeric NOT NULL,
  	"date_label" varchar,
  	"route" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "trips_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "trips_not_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "trips_observations_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"emphasis" boolean
  );
  
  CREATE TABLE "trips_pricing_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "trips_review_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "trips" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_trips_status" DEFAULT 'rascunho' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"link_target" "enum_trips_link_target" DEFAULT 'legacy' NOT NULL,
  	"legacy_url" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"period_tag" varchar,
  	"departure_tag" varchar,
  	"limited_note" varchar,
  	"featured_image_id" integer,
  	"card_art_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"days" numeric,
  	"nights" numeric,
  	"period_text" varchar,
  	"departure_city" varchar,
  	"departure_airport" varchar,
  	"accommodation" varchar,
  	"baggage" varchar,
  	"guidance_eyebrow" varchar,
  	"guidance_heading" varchar,
  	"guidance_lead" varchar,
  	"highlights_heading" varchar,
  	"highlights_intro" varchar,
  	"gallery_eyebrow" varchar,
  	"gallery_heading" varchar,
  	"package_summary_heading" varchar,
  	"package_summary_text" varchar,
  	"included_title" varchar DEFAULT 'O PREÇO DO PACOTE INCLUI:',
  	"not_included_title" varchar DEFAULT 'O PREÇO DO PACOTE NÃO INCLUI:',
  	"observations_heading" varchar DEFAULT 'OBSERVAÇÕES:',
  	"pricing_show_prices" boolean DEFAULT false,
  	"pricing_approved_at" timestamp(3) with time zone,
  	"pricing_currency" "enum_trips_pricing_currency" DEFAULT 'BRL',
  	"pricing_total_original_currency" numeric,
  	"pricing_total_brl" numeric,
  	"pricing_installments_count" numeric,
  	"pricing_installment_value_brl" numeric,
  	"pricing_extra_installments" varchar,
  	"pricing_entry_text" varchar,
  	"pricing_entry_value_brl" numeric,
  	"pricing_exchange_rate" numeric,
  	"pricing_exchange_rate_date" timestamp(3) with time zone,
  	"pricing_internal_note" varchar,
  	"pdf_id" integer,
  	"whatsapp_message" varchar,
  	"contact_name" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email" varchar,
  	"contact_validated" boolean DEFAULT false,
  	"final_cta_kicker" varchar,
  	"final_cta_heading" varchar DEFAULT 'Quer saber mais sobre esta peregrinação?',
  	"final_cta_text" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"legacy_number" numeric,
  	"legacy_wp_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "trips_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_trips_v_version_regions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__trips_v_version_regions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_trips_v_version_guides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"guide_id" integer NOT NULL,
  	"role" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_guidance_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_highlights_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"place" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_itinerary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" numeric NOT NULL,
  	"date_label" varchar,
  	"route" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_not_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_observations_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"emphasis" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_pricing_conditions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v_version_review_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_trips_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar,
  	"version_status" "enum__trips_v_version_status" DEFAULT 'rascunho' NOT NULL,
  	"version_featured" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_link_target" "enum__trips_v_version_link_target" DEFAULT 'legacy' NOT NULL,
  	"version_legacy_url" varchar,
  	"version_subtitle" varchar,
  	"version_description" varchar,
  	"version_period_tag" varchar,
  	"version_departure_tag" varchar,
  	"version_limited_note" varchar,
  	"version_featured_image_id" integer,
  	"version_card_art_id" integer,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_days" numeric,
  	"version_nights" numeric,
  	"version_period_text" varchar,
  	"version_departure_city" varchar,
  	"version_departure_airport" varchar,
  	"version_accommodation" varchar,
  	"version_baggage" varchar,
  	"version_guidance_eyebrow" varchar,
  	"version_guidance_heading" varchar,
  	"version_guidance_lead" varchar,
  	"version_highlights_heading" varchar,
  	"version_highlights_intro" varchar,
  	"version_gallery_eyebrow" varchar,
  	"version_gallery_heading" varchar,
  	"version_package_summary_heading" varchar,
  	"version_package_summary_text" varchar,
  	"version_included_title" varchar DEFAULT 'O PREÇO DO PACOTE INCLUI:',
  	"version_not_included_title" varchar DEFAULT 'O PREÇO DO PACOTE NÃO INCLUI:',
  	"version_observations_heading" varchar DEFAULT 'OBSERVAÇÕES:',
  	"version_pricing_show_prices" boolean DEFAULT false,
  	"version_pricing_approved_at" timestamp(3) with time zone,
  	"version_pricing_currency" "enum__trips_v_version_pricing_currency" DEFAULT 'BRL',
  	"version_pricing_total_original_currency" numeric,
  	"version_pricing_total_brl" numeric,
  	"version_pricing_installments_count" numeric,
  	"version_pricing_installment_value_brl" numeric,
  	"version_pricing_extra_installments" varchar,
  	"version_pricing_entry_text" varchar,
  	"version_pricing_entry_value_brl" numeric,
  	"version_pricing_exchange_rate" numeric,
  	"version_pricing_exchange_rate_date" timestamp(3) with time zone,
  	"version_pricing_internal_note" varchar,
  	"version_pdf_id" integer,
  	"version_whatsapp_message" varchar,
  	"version_contact_name" varchar,
  	"version_contact_whatsapp" varchar,
  	"version_contact_email" varchar,
  	"version_contact_validated" boolean DEFAULT false,
  	"version_final_cta_kicker" varchar,
  	"version_final_cta_heading" varchar DEFAULT 'Quer saber mais sobre esta peregrinação?',
  	"version_final_cta_text" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_legacy_number" numeric,
  	"version_legacy_wp_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_trips_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"default_role" varchar,
  	"photo_id" integer,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"original_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"original_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"whatsapp" varchar,
  	"trip_id" integer,
  	"trip_title" varchar,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"consent_at" timestamp(3) with time zone,
  	"source_page" varchar,
  	"status" "enum_inquiries_status" DEFAULT 'novo',
  	"email_delivery" "enum_inquiries_email_delivery" DEFAULT 'pendente',
  	"delivery_error" varchar,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"trips_id" integer,
  	"guides_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"inquiries_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp" varchar DEFAULT '5511992526053' NOT NULL,
  	"whatsapp_display" varchar DEFAULT '+55 11 99252-6053',
  	"phone" varchar DEFAULT '551140033216',
  	"phone_display" varchar DEFAULT '+55 11 4003-3216',
  	"email" varchar DEFAULT 'contato@vialuminaviagens.com.br',
  	"hours" varchar DEFAULT 'Seg. a Sáb. 8h - 18h',
  	"address_street" varchar DEFAULT 'Praça Dom José Gaspar, 134',
  	"address_complement" varchar DEFAULT '18º andar',
  	"address_district" varchar DEFAULT 'República',
  	"address_city" varchar DEFAULT 'São Paulo',
  	"address_state" varchar DEFAULT 'SP',
  	"address_zip" varchar DEFAULT '01047-912',
  	"default_whatsapp_message" varchar DEFAULT 'Olá! Gostaria de saber mais sobre as peregrinações da Via Lumina.',
  	"instagram_url" varchar DEFAULT 'https://www.instagram.com/vialuminaviagens/',
  	"facebook_url" varchar DEFAULT 'https://www.facebook.com/vialuminaviagens',
  	"community_url" varchar DEFAULT 'https://chat.whatsapp.com/JiqNny9Qx8YK4rwZC7nXGO',
  	"grupo_arbo_url" varchar DEFAULT 'https://grupoarbo.tur.br/',
  	"garupa_url" varchar DEFAULT 'https://garupa.org.br/',
  	"gtm_id" varchar,
  	"ga4_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "instagram_fallback_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"permalink" varchar NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "instagram" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"handle" varchar DEFAULT 'vialuminaviagens',
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "trips_regions" ADD CONSTRAINT "trips_regions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_guides" ADD CONSTRAINT "trips_guides_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips_guides" ADD CONSTRAINT "trips_guides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_guidance_points" ADD CONSTRAINT "trips_guidance_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_highlights_cards" ADD CONSTRAINT "trips_highlights_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_gallery_items" ADD CONSTRAINT "trips_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips_gallery_items" ADD CONSTRAINT "trips_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_itinerary" ADD CONSTRAINT "trips_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_included_items" ADD CONSTRAINT "trips_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_not_included_items" ADD CONSTRAINT "trips_not_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_observations_paragraphs" ADD CONSTRAINT "trips_observations_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_pricing_conditions" ADD CONSTRAINT "trips_pricing_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips_review_notes" ADD CONSTRAINT "trips_review_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_card_art_id_media_id_fk" FOREIGN KEY ("card_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_pdf_id_documents_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips" ADD CONSTRAINT "trips_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "trips_texts" ADD CONSTRAINT "trips_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_regions" ADD CONSTRAINT "_trips_v_version_regions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_guides" ADD CONSTRAINT "_trips_v_version_guides_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v_version_guides" ADD CONSTRAINT "_trips_v_version_guides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_guidance_points" ADD CONSTRAINT "_trips_v_version_guidance_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_highlights_cards" ADD CONSTRAINT "_trips_v_version_highlights_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_gallery_items" ADD CONSTRAINT "_trips_v_version_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v_version_gallery_items" ADD CONSTRAINT "_trips_v_version_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_itinerary" ADD CONSTRAINT "_trips_v_version_itinerary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_included_items" ADD CONSTRAINT "_trips_v_version_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_not_included_items" ADD CONSTRAINT "_trips_v_version_not_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_observations_paragraphs" ADD CONSTRAINT "_trips_v_version_observations_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_pricing_conditions" ADD CONSTRAINT "_trips_v_version_pricing_conditions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v_version_review_notes" ADD CONSTRAINT "_trips_v_version_review_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_parent_id_trips_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."trips"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_version_card_art_id_media_id_fk" FOREIGN KEY ("version_card_art_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_version_pdf_id_documents_id_fk" FOREIGN KEY ("version_pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v" ADD CONSTRAINT "_trips_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_trips_v_texts" ADD CONSTRAINT "_trips_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_trips_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "guides" ADD CONSTRAINT "guides_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_trips_fk" FOREIGN KEY ("trips_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_guides_fk" FOREIGN KEY ("guides_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "instagram_fallback_posts" ADD CONSTRAINT "instagram_fallback_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "instagram_fallback_posts" ADD CONSTRAINT "instagram_fallback_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."instagram"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "trips_regions_order_idx" ON "trips_regions" USING btree ("order");
  CREATE INDEX "trips_regions_parent_idx" ON "trips_regions" USING btree ("parent_id");
  CREATE INDEX "trips_guides_order_idx" ON "trips_guides" USING btree ("_order");
  CREATE INDEX "trips_guides_parent_id_idx" ON "trips_guides" USING btree ("_parent_id");
  CREATE INDEX "trips_guides_guide_idx" ON "trips_guides" USING btree ("guide_id");
  CREATE INDEX "trips_guidance_points_order_idx" ON "trips_guidance_points" USING btree ("_order");
  CREATE INDEX "trips_guidance_points_parent_id_idx" ON "trips_guidance_points" USING btree ("_parent_id");
  CREATE INDEX "trips_highlights_cards_order_idx" ON "trips_highlights_cards" USING btree ("_order");
  CREATE INDEX "trips_highlights_cards_parent_id_idx" ON "trips_highlights_cards" USING btree ("_parent_id");
  CREATE INDEX "trips_gallery_items_order_idx" ON "trips_gallery_items" USING btree ("_order");
  CREATE INDEX "trips_gallery_items_parent_id_idx" ON "trips_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "trips_gallery_items_image_idx" ON "trips_gallery_items" USING btree ("image_id");
  CREATE INDEX "trips_itinerary_order_idx" ON "trips_itinerary" USING btree ("_order");
  CREATE INDEX "trips_itinerary_parent_id_idx" ON "trips_itinerary" USING btree ("_parent_id");
  CREATE INDEX "trips_included_items_order_idx" ON "trips_included_items" USING btree ("_order");
  CREATE INDEX "trips_included_items_parent_id_idx" ON "trips_included_items" USING btree ("_parent_id");
  CREATE INDEX "trips_not_included_items_order_idx" ON "trips_not_included_items" USING btree ("_order");
  CREATE INDEX "trips_not_included_items_parent_id_idx" ON "trips_not_included_items" USING btree ("_parent_id");
  CREATE INDEX "trips_observations_paragraphs_order_idx" ON "trips_observations_paragraphs" USING btree ("_order");
  CREATE INDEX "trips_observations_paragraphs_parent_id_idx" ON "trips_observations_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "trips_pricing_conditions_order_idx" ON "trips_pricing_conditions" USING btree ("_order");
  CREATE INDEX "trips_pricing_conditions_parent_id_idx" ON "trips_pricing_conditions" USING btree ("_parent_id");
  CREATE INDEX "trips_review_notes_order_idx" ON "trips_review_notes" USING btree ("_order");
  CREATE INDEX "trips_review_notes_parent_id_idx" ON "trips_review_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "trips_slug_idx" ON "trips" USING btree ("slug");
  CREATE INDEX "trips_featured_image_idx" ON "trips" USING btree ("featured_image_id");
  CREATE INDEX "trips_card_art_idx" ON "trips" USING btree ("card_art_id");
  CREATE INDEX "trips_pdf_idx" ON "trips" USING btree ("pdf_id");
  CREATE INDEX "trips_seo_seo_image_idx" ON "trips" USING btree ("seo_image_id");
  CREATE INDEX "trips_updated_at_idx" ON "trips" USING btree ("updated_at");
  CREATE INDEX "trips_created_at_idx" ON "trips" USING btree ("created_at");
  CREATE INDEX "trips_texts_order_parent" ON "trips_texts" USING btree ("order","parent_id");
  CREATE INDEX "_trips_v_version_regions_order_idx" ON "_trips_v_version_regions" USING btree ("order");
  CREATE INDEX "_trips_v_version_regions_parent_idx" ON "_trips_v_version_regions" USING btree ("parent_id");
  CREATE INDEX "_trips_v_version_guides_order_idx" ON "_trips_v_version_guides" USING btree ("_order");
  CREATE INDEX "_trips_v_version_guides_parent_id_idx" ON "_trips_v_version_guides" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_guides_guide_idx" ON "_trips_v_version_guides" USING btree ("guide_id");
  CREATE INDEX "_trips_v_version_guidance_points_order_idx" ON "_trips_v_version_guidance_points" USING btree ("_order");
  CREATE INDEX "_trips_v_version_guidance_points_parent_id_idx" ON "_trips_v_version_guidance_points" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_highlights_cards_order_idx" ON "_trips_v_version_highlights_cards" USING btree ("_order");
  CREATE INDEX "_trips_v_version_highlights_cards_parent_id_idx" ON "_trips_v_version_highlights_cards" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_gallery_items_order_idx" ON "_trips_v_version_gallery_items" USING btree ("_order");
  CREATE INDEX "_trips_v_version_gallery_items_parent_id_idx" ON "_trips_v_version_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_gallery_items_image_idx" ON "_trips_v_version_gallery_items" USING btree ("image_id");
  CREATE INDEX "_trips_v_version_itinerary_order_idx" ON "_trips_v_version_itinerary" USING btree ("_order");
  CREATE INDEX "_trips_v_version_itinerary_parent_id_idx" ON "_trips_v_version_itinerary" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_included_items_order_idx" ON "_trips_v_version_included_items" USING btree ("_order");
  CREATE INDEX "_trips_v_version_included_items_parent_id_idx" ON "_trips_v_version_included_items" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_not_included_items_order_idx" ON "_trips_v_version_not_included_items" USING btree ("_order");
  CREATE INDEX "_trips_v_version_not_included_items_parent_id_idx" ON "_trips_v_version_not_included_items" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_observations_paragraphs_order_idx" ON "_trips_v_version_observations_paragraphs" USING btree ("_order");
  CREATE INDEX "_trips_v_version_observations_paragraphs_parent_id_idx" ON "_trips_v_version_observations_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_pricing_conditions_order_idx" ON "_trips_v_version_pricing_conditions" USING btree ("_order");
  CREATE INDEX "_trips_v_version_pricing_conditions_parent_id_idx" ON "_trips_v_version_pricing_conditions" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_version_review_notes_order_idx" ON "_trips_v_version_review_notes" USING btree ("_order");
  CREATE INDEX "_trips_v_version_review_notes_parent_id_idx" ON "_trips_v_version_review_notes" USING btree ("_parent_id");
  CREATE INDEX "_trips_v_parent_idx" ON "_trips_v" USING btree ("parent_id");
  CREATE INDEX "_trips_v_version_version_slug_idx" ON "_trips_v" USING btree ("version_slug");
  CREATE INDEX "_trips_v_version_version_featured_image_idx" ON "_trips_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_trips_v_version_version_card_art_idx" ON "_trips_v" USING btree ("version_card_art_id");
  CREATE INDEX "_trips_v_version_version_pdf_idx" ON "_trips_v" USING btree ("version_pdf_id");
  CREATE INDEX "_trips_v_version_seo_version_seo_image_idx" ON "_trips_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_trips_v_version_version_updated_at_idx" ON "_trips_v" USING btree ("version_updated_at");
  CREATE INDEX "_trips_v_version_version_created_at_idx" ON "_trips_v" USING btree ("version_created_at");
  CREATE INDEX "_trips_v_created_at_idx" ON "_trips_v" USING btree ("created_at");
  CREATE INDEX "_trips_v_updated_at_idx" ON "_trips_v" USING btree ("updated_at");
  CREATE INDEX "_trips_v_texts_order_parent" ON "_trips_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "guides_slug_idx" ON "guides" USING btree ("slug");
  CREATE INDEX "guides_photo_idx" ON "guides" USING btree ("photo_id");
  CREATE INDEX "guides_updated_at_idx" ON "guides" USING btree ("updated_at");
  CREATE INDEX "guides_created_at_idx" ON "guides" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "inquiries_trip_idx" ON "inquiries" USING btree ("trip_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_trips_id_idx" ON "payload_locked_documents_rels" USING btree ("trips_id");
  CREATE INDEX "payload_locked_documents_rels_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("guides_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "instagram_fallback_posts_order_idx" ON "instagram_fallback_posts" USING btree ("_order");
  CREATE INDEX "instagram_fallback_posts_parent_id_idx" ON "instagram_fallback_posts" USING btree ("_parent_id");
  CREATE INDEX "instagram_fallback_posts_image_idx" ON "instagram_fallback_posts" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "trips_regions" CASCADE;
  DROP TABLE "trips_guides" CASCADE;
  DROP TABLE "trips_guidance_points" CASCADE;
  DROP TABLE "trips_highlights_cards" CASCADE;
  DROP TABLE "trips_gallery_items" CASCADE;
  DROP TABLE "trips_itinerary" CASCADE;
  DROP TABLE "trips_included_items" CASCADE;
  DROP TABLE "trips_not_included_items" CASCADE;
  DROP TABLE "trips_observations_paragraphs" CASCADE;
  DROP TABLE "trips_pricing_conditions" CASCADE;
  DROP TABLE "trips_review_notes" CASCADE;
  DROP TABLE "trips" CASCADE;
  DROP TABLE "trips_texts" CASCADE;
  DROP TABLE "_trips_v_version_regions" CASCADE;
  DROP TABLE "_trips_v_version_guides" CASCADE;
  DROP TABLE "_trips_v_version_guidance_points" CASCADE;
  DROP TABLE "_trips_v_version_highlights_cards" CASCADE;
  DROP TABLE "_trips_v_version_gallery_items" CASCADE;
  DROP TABLE "_trips_v_version_itinerary" CASCADE;
  DROP TABLE "_trips_v_version_included_items" CASCADE;
  DROP TABLE "_trips_v_version_not_included_items" CASCADE;
  DROP TABLE "_trips_v_version_observations_paragraphs" CASCADE;
  DROP TABLE "_trips_v_version_pricing_conditions" CASCADE;
  DROP TABLE "_trips_v_version_review_notes" CASCADE;
  DROP TABLE "_trips_v" CASCADE;
  DROP TABLE "_trips_v_texts" CASCADE;
  DROP TABLE "guides" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "instagram_fallback_posts" CASCADE;
  DROP TABLE "instagram" CASCADE;
  DROP TYPE "public"."enum_trips_regions";
  DROP TYPE "public"."enum_trips_status";
  DROP TYPE "public"."enum_trips_link_target";
  DROP TYPE "public"."enum_trips_pricing_currency";
  DROP TYPE "public"."enum__trips_v_version_regions";
  DROP TYPE "public"."enum__trips_v_version_status";
  DROP TYPE "public"."enum__trips_v_version_link_target";
  DROP TYPE "public"."enum__trips_v_version_pricing_currency";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_email_delivery";
  DROP TYPE "public"."enum_users_roles";`)
}
