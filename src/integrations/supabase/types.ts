export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          id: string
          metadata: Json | null
          reason: string | null
          requested_at: string
          scheduled_deletion_at: string
          status: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          requested_at?: string
          scheduled_deletion_at?: string
          status?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          requested_at?: string
          scheduled_deletion_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      api_test_logs: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          method: string
          request_body: string | null
          request_headers: Json | null
          response_body: string | null
          response_status: number | null
          response_time_ms: number | null
          tested_by: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          method?: string
          request_body?: string | null
          request_headers?: Json | null
          response_body?: string | null
          response_status?: number | null
          response_time_ms?: number | null
          tested_by: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          method?: string
          request_body?: string | null
          request_headers?: Json | null
          response_body?: string | null
          response_status?: number | null
          response_time_ms?: number | null
          tested_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_test_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "tech_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      case_study_submissions: {
        Row: {
          avg_score: number | null
          content: string
          formation_id: string
          id: string
          reviews_count: number
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          content: string
          formation_id: string
          id?: string
          reviews_count?: number
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          avg_score?: number | null
          content?: string
          formation_id?: string
          id?: string
          reviews_count?: number
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cofounder_profiles: {
        Row: {
          anonymous_first_contact: boolean
          bio: string | null
          commitment: string | null
          created_at: string
          has_idea: boolean | null
          headline: string
          id: string
          idea_summary: string | null
          is_active: boolean
          linkedin_url: string | null
          location: string | null
          present_role: string | null
          role_seeking: string
          sector: string | null
          skills_have: string[] | null
          skills_need: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous_first_contact?: boolean
          bio?: string | null
          commitment?: string | null
          created_at?: string
          has_idea?: boolean | null
          headline: string
          id?: string
          idea_summary?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          location?: string | null
          present_role?: string | null
          role_seeking: string
          sector?: string | null
          skills_have?: string[] | null
          skills_need?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous_first_contact?: boolean
          bio?: string | null
          commitment?: string | null
          created_at?: string
          has_idea?: boolean | null
          headline?: string
          id?: string
          idea_summary?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          location?: string | null
          present_role?: string | null
          role_seeking?: string
          sector?: string | null
          skills_have?: string[] | null
          skills_need?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          capacity: number | null
          cover_image: string | null
          created_at: string
          description: string | null
          end_date: string | null
          event_date: string
          event_type: string
          id: string
          is_published: boolean
          location: string | null
          meeting_url: string | null
          rsvp_count: number
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date: string
          event_type?: string
          id?: string
          is_published?: boolean
          location?: string | null
          meeting_url?: string | null
          rsvp_count?: number
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capacity?: number | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_published?: boolean
          location?: string | null
          meeting_url?: string | null
          rsvp_count?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string | null
          comments_count: number
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_pinned: boolean
          likes_count: number
          link_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          likes_count?: number
          link_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_pinned?: boolean
          likes_count?: number
          link_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          access_type: string
          accessed_by: string | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type: string
          accessed_by?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          accessed_by?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dataroom_deliverables: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          deliverable_id: string
          id: string
          project_id: string
          project_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          deliverable_id: string
          id?: string
          project_id: string
          project_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          deliverable_id?: string
          id?: string
          project_id?: string
          project_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_room_access_log: {
        Row: {
          action: string
          created_at: string
          document_id: string
          id: string
          ip_address: string | null
          user_agent: string | null
          viewer_email: string | null
          viewer_id: string | null
        }
        Insert: {
          action?: string
          created_at?: string
          document_id: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewer_email?: string | null
          viewer_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          viewer_email?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_access_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "deal_room_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_deals: {
        Row: {
          amount_raised_tnd: number
          amount_target_tnd: number
          created_at: string
          deadline: string | null
          deck_url: string | null
          description: string | null
          equity_offered: number | null
          id: string
          is_public: boolean
          nda_required: boolean
          pipeline_stage: string
          round_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
          valuation_tnd: number | null
        }
        Insert: {
          amount_raised_tnd?: number
          amount_target_tnd?: number
          created_at?: string
          deadline?: string | null
          deck_url?: string | null
          description?: string | null
          equity_offered?: number | null
          id?: string
          is_public?: boolean
          nda_required?: boolean
          pipeline_stage?: string
          round_type?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          valuation_tnd?: number | null
        }
        Update: {
          amount_raised_tnd?: number
          amount_target_tnd?: number
          created_at?: string
          deadline?: string | null
          deck_url?: string | null
          description?: string | null
          equity_offered?: number | null
          id?: string
          is_public?: boolean
          nda_required?: boolean
          pipeline_stage?: string
          round_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          valuation_tnd?: number | null
        }
        Relationships: []
      }
      deal_room_documents: {
        Row: {
          allow_download: boolean
          category: string
          created_at: string
          deal_id: string | null
          expires_at: string | null
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          nda_required: boolean
          startup_id: string | null
          status: string
          updated_at: string
          user_id: string
          visibility: string
          watermark_enabled: boolean
        }
        Insert: {
          allow_download?: boolean
          category: string
          created_at?: string
          deal_id?: string | null
          expires_at?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          nda_required?: boolean
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          visibility?: string
          watermark_enabled?: boolean
        }
        Update: {
          allow_download?: boolean
          category?: string
          created_at?: string
          deal_id?: string | null
          expires_at?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          nda_required?: boolean
          startup_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          visibility?: string
          watermark_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_room_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_investor_interests: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          investor_user_id: string
          nda_signed_at: string | null
          notes: string | null
          status: string
          ticket_size_tnd: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          investor_user_id: string
          nda_signed_at?: string | null
          notes?: string | null
          status?: string
          ticket_size_tnd?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          investor_user_id?: string
          nda_signed_at?: string | null
          notes?: string | null
          status?: string
          ticket_size_tnd?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_investor_interests_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deal_room_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_nda_acceptances: {
        Row: {
          accepted_at: string
          document_id: string
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          document_id: string
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_nda_acceptances_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "deal_room_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_room_share_links: {
        Row: {
          created_at: string
          created_by: string
          document_id: string
          expires_at: string | null
          id: string
          password_hash: string | null
          revoked: boolean
          token: string
        }
        Insert: {
          created_at?: string
          created_by: string
          document_id: string
          expires_at?: string | null
          id?: string
          password_hash?: string | null
          revoked?: boolean
          token: string
        }
        Update: {
          created_at?: string
          created_by?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          password_hash?: string | null
          revoked?: boolean
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_room_share_links_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "deal_room_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      ecosystem_partners: {
        Row: {
          active_programs_count: number | null
          address: string | null
          claimed_at: string | null
          claimed_by: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          governorate: string | null
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          partner_type: string
          programs_offered: string[] | null
          sectors: string[] | null
          slug: string
          team_size_range: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active_programs_count?: number | null
          address?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          governorate?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          partner_type: string
          programs_offered?: string[] | null
          sectors?: string[] | null
          slug: string
          team_size_range?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active_programs_count?: number | null
          address?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          governorate?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          partner_type?: string
          programs_offered?: string[] | null
          sectors?: string[] | null
          slug?: string
          team_size_range?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      formation_completions: {
        Row: {
          access_level: string
          certificate_url: string | null
          completed_at: string
          domain: string
          formation_id: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          access_level?: string
          certificate_url?: string | null
          completed_at?: string
          domain: string
          formation_id: string
          id?: string
          score?: number
          user_id: string
        }
        Update: {
          access_level?: string
          certificate_url?: string | null
          completed_at?: string
          domain?: string
          formation_id?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formation_completions_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      formation_evaluations: {
        Row: {
          certificate_generated: boolean | null
          evaluated_at: string
          feedback: string | null
          formation_id: string
          id: string
          improvements: string | null
          participant_id: string
          score: number
          strengths: string | null
          user_id: string
        }
        Insert: {
          certificate_generated?: boolean | null
          evaluated_at?: string
          feedback?: string | null
          formation_id: string
          id?: string
          improvements?: string | null
          participant_id: string
          score: number
          strengths?: string | null
          user_id: string
        }
        Update: {
          certificate_generated?: boolean | null
          evaluated_at?: string
          feedback?: string | null
          formation_id?: string
          id?: string
          improvements?: string | null
          participant_id?: string
          score?: number
          strengths?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formation_evaluations_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formation_evaluations_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "formation_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      formation_participants: {
        Row: {
          completed_at: string | null
          email: string
          enrolled_at: string
          formation_id: string
          full_name: string
          id: string
          progress_percent: number | null
          startup_stage: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          email: string
          enrolled_at?: string
          formation_id: string
          full_name: string
          id?: string
          progress_percent?: number | null
          startup_stage?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          email?: string
          enrolled_at?: string
          formation_id?: string
          full_name?: string
          id?: string
          progress_percent?: number | null
          startup_stage?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "formation_participants_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      formation_quizzes: {
        Row: {
          formation_id: string
          generated_at: string
          id: string
          questions: Json
        }
        Insert: {
          formation_id: string
          generated_at?: string
          id?: string
          questions?: Json
        }
        Update: {
          formation_id?: string
          generated_at?: string
          id?: string
          questions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_quiz_formation"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      formation_trainers: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          expertise_domain: string
          full_name: string
          id: string
          linkedin_url: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          expertise_domain: string
          full_name: string
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          expertise_domain?: string
          full_name?: string
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      formations: {
        Row: {
          created_at: string
          description: string | null
          domain: string
          duration_hours: number | null
          id: string
          is_active: boolean
          is_distance: boolean
          level: string | null
          max_participants: number | null
          modules_count: number | null
          slug: string | null
          title: string
          trainer_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          domain?: string
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          is_distance?: boolean
          level?: string | null
          max_participants?: number | null
          modules_count?: number | null
          slug?: string | null
          title: string
          trainer_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          domain?: string
          duration_hours?: number | null
          id?: string
          is_active?: boolean
          is_distance?: boolean
          level?: string | null
          max_participants?: number | null
          modules_count?: number | null
          slug?: string | null
          title?: string
          trainer_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_formations_trainer"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "formation_trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_chat_messages: {
        Row: {
          channel: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          channel?: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          category: string
          content: string
          created_at: string
          duration_text: string | null
          formation_plan: string | null
          id: string
          is_pinned: boolean
          meet_link: string | null
          replies_count: number
          scheduled_date: string | null
          title: string
          trainer_email: string | null
          trainer_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          duration_text?: string | null
          formation_plan?: string | null
          id?: string
          is_pinned?: boolean
          meet_link?: string | null
          replies_count?: number
          scheduled_date?: string | null
          title: string
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          duration_text?: string | null
          formation_plan?: string | null
          id?: string
          is_pinned?: boolean
          meet_link?: string | null
          replies_count?: number
          scheduled_date?: string | null
          title?: string
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funding_application_events: {
        Row: {
          application_id: string
          created_at: string
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          title: string
          user_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          title: string
          user_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "funding_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_applications: {
        Row: {
          amount_awarded_tnd: number | null
          amount_requested_tnd: number | null
          created_at: string
          custom_program_name: string | null
          decision_date: string | null
          documents_ready: boolean | null
          id: string
          match_score: number | null
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          priority: string | null
          program_id: string | null
          startup_id: string | null
          status: string
          submission_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_awarded_tnd?: number | null
          amount_requested_tnd?: number | null
          created_at?: string
          custom_program_name?: string | null
          decision_date?: string | null
          documents_ready?: boolean | null
          id?: string
          match_score?: number | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          program_id?: string | null
          startup_id?: string | null
          status?: string
          submission_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_awarded_tnd?: number | null
          amount_requested_tnd?: number | null
          created_at?: string
          custom_program_name?: string | null
          decision_date?: string | null
          documents_ready?: boolean | null
          id?: string
          match_score?: number | null
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          priority?: string | null
          program_id?: string | null
          startup_id?: string | null
          status?: string
          submission_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_applications_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "funding_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_programs: {
        Row: {
          application_url: string | null
          benefits: string | null
          contact_email: string | null
          country: string
          created_at: string
          deadline: string | null
          description: string | null
          difficulty: string | null
          duration_months: number | null
          eligibility: string | null
          equity_required: boolean | null
          id: string
          is_active: boolean | null
          is_rolling: boolean | null
          logo_url: string | null
          max_amount_tnd: number | null
          min_amount_tnd: number | null
          name: string
          organization: string
          regional_priority: boolean | null
          sectors: string[] | null
          stages: string[] | null
          tags: string[] | null
          target_governorates: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          benefits?: string | null
          contact_email?: string | null
          country?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          duration_months?: number | null
          eligibility?: string | null
          equity_required?: boolean | null
          id?: string
          is_active?: boolean | null
          is_rolling?: boolean | null
          logo_url?: string | null
          max_amount_tnd?: number | null
          min_amount_tnd?: number | null
          name: string
          organization: string
          regional_priority?: boolean | null
          sectors?: string[] | null
          stages?: string[] | null
          tags?: string[] | null
          target_governorates?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          benefits?: string | null
          contact_email?: string | null
          country?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          difficulty?: string | null
          duration_months?: number | null
          eligibility?: string | null
          equity_required?: boolean | null
          id?: string
          is_active?: boolean | null
          is_rolling?: boolean | null
          logo_url?: string | null
          max_amount_tnd?: number | null
          min_amount_tnd?: number | null
          name?: string
          organization?: string
          regional_priority?: boolean | null
          sectors?: string[] | null
          stages?: string[] | null
          tags?: string[] | null
          target_governorates?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      incubation_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          project_id: string
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id: string
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incubation_activities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "incubation_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_milestones: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          project_id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incubation_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "strategic_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_projects: {
        Row: {
          blocked_reason: string | null
          business_model: string | null
          competitors: string[] | null
          created_at: string | null
          current_step: number | null
          description: string | null
          differentiator: string | null
          governorate: string | null
          has_revenue: boolean | null
          has_users: boolean | null
          id: string
          is_blocked: boolean
          name: string
          overall_progress: number | null
          problem_description: string | null
          revenue_amount: number | null
          sector: string | null
          solution_description: string | null
          stage: string | null
          startup_id: string | null
          status: string | null
          target_customers: string | null
          updated_at: string | null
          user_count: number | null
          user_id: string
        }
        Insert: {
          blocked_reason?: string | null
          business_model?: string | null
          competitors?: string[] | null
          created_at?: string | null
          current_step?: number | null
          description?: string | null
          differentiator?: string | null
          governorate?: string | null
          has_revenue?: boolean | null
          has_users?: boolean | null
          id?: string
          is_blocked?: boolean
          name: string
          overall_progress?: number | null
          problem_description?: string | null
          revenue_amount?: number | null
          sector?: string | null
          solution_description?: string | null
          stage?: string | null
          startup_id?: string | null
          status?: string | null
          target_customers?: string | null
          updated_at?: string | null
          user_count?: number | null
          user_id: string
        }
        Update: {
          blocked_reason?: string | null
          business_model?: string | null
          competitors?: string[] | null
          created_at?: string | null
          current_step?: number | null
          description?: string | null
          differentiator?: string | null
          governorate?: string | null
          has_revenue?: boolean | null
          has_users?: boolean | null
          id?: string
          is_blocked?: boolean
          name?: string
          overall_progress?: number | null
          problem_description?: string | null
          revenue_amount?: number | null
          sector?: string | null
          solution_description?: string | null
          stage?: string | null
          startup_id?: string | null
          status?: string | null
          target_customers?: string | null
          updated_at?: string | null
          user_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      incubation_reports: {
        Row: {
          ai_score: number | null
          content: Json
          created_at: string | null
          exported_at: string | null
          id: string
          project_id: string
          report_type: string
          status: string | null
          step_id: string
          test_data: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_score?: number | null
          content?: Json
          created_at?: string | null
          exported_at?: string | null
          id?: string
          project_id: string
          report_type: string
          status?: string | null
          step_id: string
          test_data?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_score?: number | null
          content?: Json
          created_at?: string | null
          exported_at?: string | null
          id?: string
          project_id?: string
          report_type?: string
          status?: string | null
          step_id?: string
          test_data?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incubation_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "incubation_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incubation_reports_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "incubation_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_steps: {
        Row: {
          ai_report_content: Json | null
          ai_report_score: number | null
          ai_report_status: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          gate_criteria: string | null
          gate_status: string | null
          id: string
          name: string
          project_id: string
          started_at: string | null
          status: string | null
          step_number: number
          updated_at: string | null
        }
        Insert: {
          ai_report_content?: Json | null
          ai_report_score?: number | null
          ai_report_status?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          gate_criteria?: string | null
          gate_status?: string | null
          id?: string
          name: string
          project_id: string
          started_at?: string | null
          status?: string | null
          step_number: number
          updated_at?: string | null
        }
        Update: {
          ai_report_content?: Json | null
          ai_report_score?: number | null
          ai_report_status?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          gate_criteria?: string | null
          gate_status?: string | null
          id?: string
          name?: string
          project_id?: string
          started_at?: string | null
          status?: string | null
          step_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incubation_steps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "incubation_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_badges: {
        Row: {
          badge_code: string
          earned_at: string
          icon: string | null
          id: string
          label: string
          phase_id: number | null
          user_id: string
        }
        Insert: {
          badge_code: string
          earned_at?: string
          icon?: string | null
          id?: string
          label: string
          phase_id?: number | null
          user_id: string
        }
        Update: {
          badge_code?: string
          earned_at?: string
          icon?: string | null
          id?: string
          label?: string
          phase_id?: number | null
          user_id?: string
        }
        Relationships: []
      }
      journey_leaderboard_optin: {
        Row: {
          display_name: string | null
          is_anonymous: boolean
          is_optin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          is_anonymous?: boolean
          is_optin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          is_anonymous?: boolean
          is_optin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_stage_validations: {
        Row: {
          coach_id: string | null
          coach_notes: string | null
          created_at: string
          evidence_notes: string | null
          id: string
          phase_id: number
          requested_at: string
          reviewed_at: string | null
          self_assessment_score: number | null
          status: string
          user_id: string
        }
        Insert: {
          coach_id?: string | null
          coach_notes?: string | null
          created_at?: string
          evidence_notes?: string | null
          id?: string
          phase_id: number
          requested_at?: string
          reviewed_at?: string | null
          self_assessment_score?: number | null
          status?: string
          user_id: string
        }
        Update: {
          coach_id?: string | null
          coach_notes?: string | null
          created_at?: string
          evidence_notes?: string | null
          id?: string
          phase_id?: number
          requested_at?: string
          reviewed_at?: string | null
          self_assessment_score?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_streaks: {
        Row: {
          current_streak: number
          last_activity_date: string | null
          longest_streak: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_activity_date?: string | null
          longest_streak?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base_tests: {
        Row: {
          applicable_sectors: string[] | null
          associated_step: number | null
          category: string
          created_at: string | null
          description: string | null
          detailed_protocol: Json | null
          difficulty_level: string | null
          estimated_duration: string | null
          id: string
          name: string
          objective: string | null
          phase: string
          recommended_tools: string[] | null
          tags: string[] | null
          target_metrics: Json | null
          test_number: number
        }
        Insert: {
          applicable_sectors?: string[] | null
          associated_step?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          detailed_protocol?: Json | null
          difficulty_level?: string | null
          estimated_duration?: string | null
          id?: string
          name: string
          objective?: string | null
          phase: string
          recommended_tools?: string[] | null
          tags?: string[] | null
          target_metrics?: Json | null
          test_number: number
        }
        Update: {
          applicable_sectors?: string[] | null
          associated_step?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          detailed_protocol?: Json | null
          difficulty_level?: string | null
          estimated_duration?: string | null
          id?: string
          name?: string
          objective?: string | null
          phase?: string
          recommended_tools?: string[] | null
          tags?: string[] | null
          target_metrics?: Json | null
          test_number?: number
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean
          locale: string
          published_at: string
          slug: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          locale?: string
          published_at?: string
          slug: string
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          locale?: string
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      license_keys: {
        Row: {
          content_name: string
          content_slug: string
          created_at: string
          current_uses: number
          duration_hours: number | null
          expires_at: string | null
          formation_date: string | null
          id: string
          is_active: boolean
          key_code: string
          max_uses: number | null
          source_author: string | null
          source_author_image: string | null
          source_label: string | null
        }
        Insert: {
          content_name: string
          content_slug: string
          created_at?: string
          current_uses?: number
          duration_hours?: number | null
          expires_at?: string | null
          formation_date?: string | null
          id?: string
          is_active?: boolean
          key_code: string
          max_uses?: number | null
          source_author?: string | null
          source_author_image?: string | null
          source_label?: string | null
        }
        Update: {
          content_name?: string
          content_slug?: string
          created_at?: string
          current_uses?: number
          duration_hours?: number | null
          expires_at?: string | null
          formation_date?: string | null
          id?: string
          is_active?: boolean
          key_code?: string
          max_uses?: number | null
          source_author?: string | null
          source_author_image?: string | null
          source_label?: string | null
        }
        Relationships: []
      }
      market_intelligence_reports: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          linked_strategic_action: string | null
          report_type: string
          result_data: Json | null
          result_markdown: string | null
          score: number | null
          sector: string | null
          source: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          linked_strategic_action?: string | null
          report_type: string
          result_data?: Json | null
          result_markdown?: string | null
          score?: number | null
          sector?: string | null
          source?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          linked_strategic_action?: string | null
          report_type?: string
          result_data?: Json | null
          result_markdown?: string | null
          score?: number | null
          sector?: string | null
          source?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_bookmarks: {
        Row: {
          created_at: string
          id: string
          startup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          startup_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          startup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_bookmarks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          is_helpful: boolean
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          is_helpful?: boolean
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          is_helpful?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "marketplace_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          startup_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          startup_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          startup_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "marketplace_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_comments_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_ecosystem_startups: {
        Row: {
          ecosystem_id: string
          joined_at: string
          startup_id: string
        }
        Insert: {
          ecosystem_id: string
          joined_at?: string
          startup_id: string
        }
        Update: {
          ecosystem_id?: string
          joined_at?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_ecosystem_startups_ecosystem_id_fkey"
            columns: ["ecosystem_id"]
            isOneToOne: false
            referencedRelation: "marketplace_ecosystems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_ecosystem_startups_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_ecosystems: {
        Row: {
          actors: string[] | null
          created_at: string
          description: string | null
          id: string
          indicators: Json | null
          location: string | null
          logo_url: string | null
          name: string
          sectors_covered: string[] | null
          slug: string
          startup_count: number | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          actors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          indicators?: Json | null
          location?: string | null
          logo_url?: string | null
          name: string
          sectors_covered?: string[] | null
          slug: string
          startup_count?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          actors?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          indicators?: Json | null
          location?: string | null
          logo_url?: string | null
          name?: string
          sectors_covered?: string[] | null
          slug?: string
          startup_count?: number | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      marketplace_forum_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          likes_count: number
          replies_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          replies_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "marketplace_forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_founders: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          role_title: string | null
          startup_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          role_title?: string | null
          startup_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          role_title?: string | null
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_founders_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_funding_rounds: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          investors: string[] | null
          round_date: string | null
          round_type: string
          startup_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          investors?: string[] | null
          round_date?: string | null
          round_type?: string
          startup_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          investors?: string[] | null
          round_date?: string | null
          round_type?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_funding_rounds_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_kpis: {
        Row: {
          id: string
          metric_name: string
          metric_value: string
          recorded_at: string
          startup_id: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value: string
          recorded_at?: string
          startup_id: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: string
          recorded_at?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_kpis_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
          startup_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
          startup_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_messages_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_news: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string | null
          created_at: string
          id: string
          is_approved: boolean
          news_type: string
          startup_id: string | null
          submitted_by: string
          title: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          news_type?: string
          startup_id?: string | null
          submitted_by: string
          title: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          news_type?: string
          startup_id?: string | null
          submitted_by?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_news_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_pitch_decks: {
        Row: {
          file_name: string | null
          file_url: string
          id: string
          startup_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name?: string | null
          file_url: string
          id?: string
          startup_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string | null
          file_url?: string
          id?: string
          startup_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_pitch_decks_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_programs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      marketplace_startups: {
        Row: {
          alternatives: string[] | null
          category: string | null
          comments_count: number
          created_at: string
          created_by: string
          description: string | null
          equity_split: Json | null
          founded_date: string | null
          founders_count: number | null
          governorate: string | null
          id: string
          is_approved: boolean
          keywords: string[] | null
          location: string | null
          logo_url: string | null
          looking_for: string[] | null
          mvp_url: string | null
          name: string
          pitch_deck_url: string | null
          program: string | null
          sector: string
          slug: string
          stage: string
          tagline: string | null
          updated_at: string
          video_url: string | null
          views_count: number
          votes_count: number
          website_url: string | null
        }
        Insert: {
          alternatives?: string[] | null
          category?: string | null
          comments_count?: number
          created_at?: string
          created_by: string
          description?: string | null
          equity_split?: Json | null
          founded_date?: string | null
          founders_count?: number | null
          governorate?: string | null
          id?: string
          is_approved?: boolean
          keywords?: string[] | null
          location?: string | null
          logo_url?: string | null
          looking_for?: string[] | null
          mvp_url?: string | null
          name: string
          pitch_deck_url?: string | null
          program?: string | null
          sector?: string
          slug: string
          stage?: string
          tagline?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          votes_count?: number
          website_url?: string | null
        }
        Update: {
          alternatives?: string[] | null
          category?: string | null
          comments_count?: number
          created_at?: string
          created_by?: string
          description?: string | null
          equity_split?: Json | null
          founded_date?: string | null
          founders_count?: number | null
          governorate?: string | null
          id?: string
          is_approved?: boolean
          keywords?: string[] | null
          location?: string | null
          logo_url?: string | null
          looking_for?: string[] | null
          mvp_url?: string | null
          name?: string
          pitch_deck_url?: string | null
          program?: string | null
          sector?: string
          slug?: string
          stage?: string
          tagline?: string | null
          updated_at?: string
          video_url?: string | null
          views_count?: number
          votes_count?: number
          website_url?: string | null
        }
        Relationships: []
      }
      marketplace_votes: {
        Row: {
          created_at: string
          id: string
          startup_id: string
          user_id: string
          vote_date: string
          vote_type: number
        }
        Insert: {
          created_at?: string
          id?: string
          startup_id: string
          user_id: string
          vote_date?: string
          vote_type?: number
        }
        Update: {
          created_at?: string
          id?: string
          startup_id?: string
          user_id?: string
          vote_date?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_votes_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_availability: {
        Row: {
          created_at: string
          day_of_week: number | null
          end_time: string
          id: string
          is_recurring: boolean
          mentor_id: string
          specific_date: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          end_time: string
          id?: string
          is_recurring?: boolean
          mentor_id: string
          specific_date?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_recurring?: boolean
          mentor_id?: string
          specific_date?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_reviews: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_role: string
          session_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_role: string
          session_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          reviewer_role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_sessions: {
        Row: {
          agenda: string
          created_at: string
          duration_minutes: number
          id: string
          meet_link: string | null
          mentor_id: string
          mentor_notes: string | null
          scheduled_at: string
          session_type: string
          startup_notes: string | null
          startup_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          agenda: string
          created_at?: string
          duration_minutes?: number
          id?: string
          meet_link?: string | null
          mentor_id: string
          mentor_notes?: string | null
          scheduled_at: string
          session_type: string
          startup_notes?: string | null
          startup_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          agenda?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          meet_link?: string | null
          mentor_id?: string
          mentor_notes?: string | null
          scheduled_at?: string
          session_type?: string
          startup_notes?: string | null
          startup_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentoring_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          meet_link: string | null
          mentor_email: string | null
          mentor_name: string
          notes: string | null
          scheduled_at: string
          status: string
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meet_link?: string | null
          mentor_email?: string | null
          mentor_name: string
          notes?: string | null
          scheduled_at: string
          status?: string
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          meet_link?: string | null
          mentor_email?: string | null
          mentor_name?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          avg_rating: number | null
          bio: string | null
          companies: string[] | null
          country_code: string | null
          created_at: string
          expertise_tags: string[] | null
          full_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean
          languages: string[] | null
          linkedin_url: string | null
          photo_url: string | null
          reviews_count: number | null
          sectors: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          avg_rating?: number | null
          bio?: string | null
          companies?: string[] | null
          country_code?: string | null
          created_at?: string
          expertise_tags?: string[] | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          languages?: string[] | null
          linkedin_url?: string | null
          photo_url?: string | null
          reviews_count?: number | null
          sectors?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          avg_rating?: number | null
          bio?: string | null
          companies?: string[] | null
          country_code?: string | null
          created_at?: string
          expertise_tags?: string[] | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          languages?: string[] | null
          linkedin_url?: string | null
          photo_url?: string | null
          reviews_count?: number | null
          sectors?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      mvp_features: {
        Row: {
          completion_percentage: number
          created_at: string
          id: string
          name: string
          priority: string
          project_id: string
          test_result: string
          tested: boolean
          updated_at: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          id?: string
          name: string
          priority?: string
          project_id: string
          test_result?: string
          tested?: boolean
          updated_at?: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          id?: string
          name?: string
          priority?: string
          project_id?: string
          test_result?: string
          tested?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mvp_features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_hypotheses: {
        Row: {
          confidence_score: number
          created_at: string
          description: string
          id: string
          project_id: string
          test_method: string | null
          type: string
          updated_at: string
          validation_status: string
          weight: number
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          description: string
          id?: string
          project_id: string
          test_method?: string | null
          type?: string
          updated_at?: string
          validation_status?: string
          weight?: number
        }
        Update: {
          confidence_score?: number
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          test_method?: string | null
          type?: string
          updated_at?: string
          validation_status?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "mvp_hypotheses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_metrics: {
        Row: {
          burn_rate: number | null
          cac: number | null
          churn_rate: number | null
          created_at: string
          id: string
          ltv: number | null
          month: string
          mrr: number | null
          nps: number | null
          project_id: string
          revenue: number | null
          updated_at: string
          users_count: number | null
        }
        Insert: {
          burn_rate?: number | null
          cac?: number | null
          churn_rate?: number | null
          created_at?: string
          id?: string
          ltv?: number | null
          month: string
          mrr?: number | null
          nps?: number | null
          project_id: string
          revenue?: number | null
          updated_at?: string
          users_count?: number | null
        }
        Update: {
          burn_rate?: number | null
          cac?: number | null
          churn_rate?: number | null
          created_at?: string
          id?: string
          ltv?: number | null
          month?: string
          mrr?: number | null
          nps?: number | null
          project_id?: string
          revenue?: number | null
          updated_at?: string
          users_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mvp_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_personas: {
        Row: {
          age_range: string | null
          conversion_rate: number
          created_at: string
          description: string | null
          emotional_profile: string | null
          governorate: string | null
          id: string
          interviews_done: number
          interviews_target: number
          is_early_adopter: boolean
          name: string
          project_id: string
          psycho_profile: string | null
          satisfaction_score: number
          socio_profile: string | null
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          conversion_rate?: number
          created_at?: string
          description?: string | null
          emotional_profile?: string | null
          governorate?: string | null
          id?: string
          interviews_done?: number
          interviews_target?: number
          is_early_adopter?: boolean
          name: string
          project_id: string
          psycho_profile?: string | null
          satisfaction_score?: number
          socio_profile?: string | null
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          conversion_rate?: number
          created_at?: string
          description?: string | null
          emotional_profile?: string | null
          governorate?: string | null
          id?: string
          interviews_done?: number
          interviews_target?: number
          is_early_adopter?: boolean
          name?: string
          project_id?: string
          psycho_profile?: string | null
          satisfaction_score?: number
          socio_profile?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mvp_personas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_team_members: {
        Row: {
          availability_percent: number
          created_at: string
          experience_years: number | null
          id: string
          name: string
          project_id: string
          role: string
          skills: Json
          updated_at: string
        }
        Insert: {
          availability_percent?: number
          created_at?: string
          experience_years?: number | null
          id?: string
          name: string
          project_id: string
          role?: string
          skills?: Json
          updated_at?: string
        }
        Update: {
          availability_percent?: number
          created_at?: string
          experience_years?: number | null
          id?: string
          name?: string
          project_id?: string
          role?: string
          skills?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mvp_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_test_results: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          project_id: string
          qualitative_result: string | null
          quantitative_result: number | null
          start_date: string | null
          status: string
          test_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          project_id: string
          qualitative_result?: string | null
          quantitative_result?: number | null
          start_date?: string | null
          status?: string
          test_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          project_id?: string
          qualitative_result?: string | null
          quantitative_result?: number | null
          start_date?: string | null
          status?: string
          test_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mvp_test_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mvp_test_results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "mvp_tests_library"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_tests: {
        Row: {
          ai_verdict: Json | null
          attachments: string[] | null
          category: string
          created_at: string | null
          executed_at: string | null
          id: string
          name: string
          objective: string
          project_id: string
          protocol: Json | null
          qualitative_result: string | null
          quantitative_result: number | null
          quantitative_unit: string | null
          recommended_tools: string[] | null
          status: string | null
          step_id: string
          target_metrics: Json | null
          test_number: number
          updated_at: string | null
        }
        Insert: {
          ai_verdict?: Json | null
          attachments?: string[] | null
          category: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          name: string
          objective: string
          project_id: string
          protocol?: Json | null
          qualitative_result?: string | null
          quantitative_result?: number | null
          quantitative_unit?: string | null
          recommended_tools?: string[] | null
          status?: string | null
          step_id: string
          target_metrics?: Json | null
          test_number: number
          updated_at?: string | null
        }
        Update: {
          ai_verdict?: Json | null
          attachments?: string[] | null
          category?: string
          created_at?: string | null
          executed_at?: string | null
          id?: string
          name?: string
          objective?: string
          project_id?: string
          protocol?: Json | null
          qualitative_result?: string | null
          quantitative_result?: number | null
          quantitative_unit?: string | null
          recommended_tools?: string[] | null
          status?: string | null
          step_id?: string
          target_metrics?: Json | null
          test_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mvp_tests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "incubation_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mvp_tests_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "incubation_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      mvp_tests_library: {
        Row: {
          applicable_scenarios: string[] | null
          applicable_sectors: string[] | null
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_duration: string | null
          form_fields: Json | null
          id: string
          name: string
          phase: string
          protocol_steps: Json | null
          required_tools: string[] | null
          techniques: string[] | null
        }
        Insert: {
          applicable_scenarios?: string[] | null
          applicable_sectors?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          form_fields?: Json | null
          id?: string
          name: string
          phase: string
          protocol_steps?: Json | null
          required_tools?: string[] | null
          techniques?: string[] | null
        }
        Update: {
          applicable_scenarios?: string[] | null
          applicable_sectors?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: string | null
          form_fields?: Json | null
          id?: string
          name?: string
          phase?: string
          protocol_steps?: Json | null
          required_tools?: string[] | null
          techniques?: string[] | null
        }
        Relationships: []
      }
      mvp_validator_projects: {
        Row: {
          cofounders_count: number | null
          created_at: string
          description: string | null
          governorate: string | null
          id: string
          incubation_program: string | null
          name: string
          scenario: string
          sector: string
          sso: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cofounders_count?: number | null
          created_at?: string
          description?: string | null
          governorate?: string | null
          id?: string
          incubation_program?: string | null
          name: string
          scenario?: string
          sector?: string
          sso?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cofounders_count?: number | null
          created_at?: string
          description?: string | null
          governorate?: string | null
          id?: string
          incubation_program?: string | null
          name?: string
          scenario?: string
          sector?: string
          sso?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_followers: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_followers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "ecosystem_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_reviews: {
        Row: {
          feedback: string | null
          id: string
          reviewed_at: string
          reviewer_id: string
          score: number
          submission_id: string
        }
        Insert: {
          feedback?: string | null
          id?: string
          reviewed_at?: string
          reviewer_id: string
          score: number
          submission_id: string
        }
        Update: {
          feedback?: string | null
          id?: string
          reviewed_at?: string
          reviewer_id?: string
          score?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_review_submission"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "case_study_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          connected_modules: Json | null
          created_at: string | null
          expertise_domain: string | null
          full_name: string | null
          id: string
          investment_thesis: string | null
          onboarding_completed: boolean
          onboarding_goals: Json | null
          onboarding_step: number
          phone: string | null
          preferred_language: string
          problem_statement: string | null
          program_name: string | null
          role_type: Database["public"]["Enums"]["user_role_type"] | null
          startup_name: string | null
          startup_sector: string | null
          startup_stage: string | null
          team_size: number | null
          updated_at: string | null
          use_eastern_numerals: boolean
          user_id: string
          wilaya: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          connected_modules?: Json | null
          created_at?: string | null
          expertise_domain?: string | null
          full_name?: string | null
          id?: string
          investment_thesis?: string | null
          onboarding_completed?: boolean
          onboarding_goals?: Json | null
          onboarding_step?: number
          phone?: string | null
          preferred_language?: string
          problem_statement?: string | null
          program_name?: string | null
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          startup_name?: string | null
          startup_sector?: string | null
          startup_stage?: string | null
          team_size?: number | null
          updated_at?: string | null
          use_eastern_numerals?: boolean
          user_id: string
          wilaya?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          connected_modules?: Json | null
          created_at?: string | null
          expertise_domain?: string | null
          full_name?: string | null
          id?: string
          investment_thesis?: string | null
          onboarding_completed?: boolean
          onboarding_goals?: Json | null
          onboarding_step?: number
          phone?: string | null
          preferred_language?: string
          problem_statement?: string | null
          program_name?: string | null
          role_type?: Database["public"]["Enums"]["user_role_type"] | null
          startup_name?: string | null
          startup_sector?: string | null
          startup_stage?: string | null
          team_size?: number | null
          updated_at?: string | null
          use_eastern_numerals?: boolean
          user_id?: string
          wilaya?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempted_at: string
          formation_id: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          selected_questions: Json
          total_questions: number
          user_id: string
        }
        Insert: {
          answers?: Json
          attempted_at?: string
          formation_id: string
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          selected_questions?: Json
          total_questions?: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempted_at?: string
          formation_id?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          selected_questions?: Json
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_attempt_quiz"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "formation_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_documents: {
        Row: {
          doc_name: string
          doc_type: string
          file_size_bytes: number | null
          file_url: string | null
          id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          doc_name: string
          doc_type: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          doc_name?: string
          doc_type?: string
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_journey_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          milestone_id: string
          phase_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          milestone_id: string
          phase_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          milestone_id?: string
          phase_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_legal_compliance: {
        Row: {
          admin_notes: string | null
          bank_account_pro: boolean
          cnss_declared: boolean
          created_at: string
          id: string
          legal_form: string
          patente_obtained: boolean
          rne_date: string | null
          rne_number: string | null
          rne_registered: boolean
          startup_act_application_date: string | null
          startup_act_certificate_path: string | null
          startup_act_labeled: boolean
          startup_act_verified: boolean
          startup_act_verified_at: string | null
          startup_act_verified_by: string | null
          startup_id: string | null
          tribunal_greffe: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bank_account_pro?: boolean
          cnss_declared?: boolean
          created_at?: string
          id?: string
          legal_form?: string
          patente_obtained?: boolean
          rne_date?: string | null
          rne_number?: string | null
          rne_registered?: boolean
          startup_act_application_date?: string | null
          startup_act_certificate_path?: string | null
          startup_act_labeled?: boolean
          startup_act_verified?: boolean
          startup_act_verified_at?: string | null
          startup_act_verified_by?: string | null
          startup_id?: string | null
          tribunal_greffe?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bank_account_pro?: boolean
          cnss_declared?: boolean
          created_at?: string
          id?: string
          legal_form?: string
          patente_obtained?: boolean
          rne_date?: string | null
          rne_number?: string | null
          rne_registered?: boolean
          startup_act_application_date?: string | null
          startup_act_certificate_path?: string | null
          startup_act_labeled?: boolean
          startup_act_verified?: boolean
          startup_act_verified_at?: string | null
          startup_act_verified_by?: string | null
          startup_id?: string | null
          tribunal_greffe?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_private_documents: {
        Row: {
          category: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          startup_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          startup_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          startup_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_private_documents_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "marketplace_startups"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_access_requests: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          motivation: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          sector: string | null
          startup_name: string | null
          status: string
          updated_at: string
          user_email: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          motivation?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sector?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          motivation?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          sector?: string | null
          startup_name?: string | null
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      strategic_discussions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_admin: boolean
          request_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          request_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          request_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_discussions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "strategic_access_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          phase: number
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          phase?: number
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          phase?: number
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "strategic_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_projects: {
        Row: {
          blocked_reason: string | null
          completed_at: string | null
          created_at: string
          current_phase: number
          description: string | null
          has_idea: boolean | null
          id: string
          incubation_active: boolean | null
          is_blocked: boolean
          name: string
          sector: string | null
          startup_stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          current_phase?: number
          description?: string | null
          has_idea?: boolean | null
          id?: string
          incubation_active?: boolean | null
          is_blocked?: boolean
          name: string
          sector?: string | null
          startup_stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          current_phase?: number
          description?: string | null
          has_idea?: boolean | null
          id?: string
          incubation_active?: boolean | null
          is_blocked?: boolean
          name?: string
          sector?: string | null
          startup_stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tech_checklist_items: {
        Row: {
          category: string
          checked_at: string | null
          checked_by: string | null
          created_at: string
          id: string
          is_checked: boolean
          label: string
          project_id: string
          user_id: string
        }
        Insert: {
          category: string
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          label: string
          project_id: string
          user_id: string
        }
        Update: {
          category?: string
          checked_at?: string | null
          checked_by?: string | null
          created_at?: string
          id?: string
          is_checked?: boolean
          label?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_checklist_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_integrations: {
        Row: {
          base_url: string | null
          connection_status: string
          created_at: string
          criticality: string
          id: string
          integration_type: string
          last_tested_at: string | null
          notes: string | null
          project_id: string
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          base_url?: string | null
          connection_status?: string
          created_at?: string
          criticality?: string
          id?: string
          integration_type?: string
          last_tested_at?: string | null
          notes?: string | null
          project_id: string
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          base_url?: string | null
          connection_status?: string
          created_at?: string
          criticality?: string
          id?: string
          integration_type?: string
          last_tested_at?: string | null
          notes?: string | null
          project_id?: string
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tech_integrations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "mvp_validator_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_animated_sessions: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          evaluation_avg: number | null
          id: string
          participants_count: number
          resources_url: string | null
          scheduled_date: string
          status: string
          theme: string
          title: string
          trainer_user_id: string
          updated_at: string
          validated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          evaluation_avg?: number | null
          id?: string
          participants_count?: number
          resources_url?: string | null
          scheduled_date: string
          status?: string
          theme: string
          title: string
          trainer_user_id: string
          updated_at?: string
          validated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          evaluation_avg?: number | null
          id?: string
          participants_count?: number
          resources_url?: string | null
          scheduled_date?: string
          status?: string
          theme?: string
          title?: string
          trainer_user_id?: string
          updated_at?: string
          validated_at?: string | null
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          consent_type: string
          created_at: string
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
          version: string
          withdrawn_at: string | null
        }
        Insert: {
          consent_type: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          version?: string
          withdrawn_at?: string | null
        }
        Update: {
          consent_type?: string
          created_at?: string
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          version?: string
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      regional_equity_stats: {
        Row: {
          governorate: string | null
          projects_count: number | null
          startups_count: number | null
          targeted_programs_count: number | null
          users_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_notification: {
        Args: {
          _link?: string
          _message: string
          _title: string
          _type: string
          _user_id: string
        }
        Returns: undefined
      }
      get_quiz_questions_safe: {
        Args: { p_formation_id: string }
        Returns: Json
      }
      get_safe_forum_threads: {
        Args: never
        Returns: {
          category: string
          content: string
          created_at: string
          duration_text: string
          formation_plan: string
          id: string
          is_pinned: boolean
          is_strategic: boolean
          max_participants: number
          meet_link: string
          min_participants: number
          objectives: string
          replies_count: number
          scheduled_date: string
          title: string
          trainer_email: string
          trainer_name: string
          updated_at: string
          user_id: string
        }[]
      }
      get_users_with_roles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_license_key: {
        Args: { _content_slug: string; _key_code: string }
        Returns: Json
      }
      validate_quiz_answers: {
        Args: { p_answers: Json; p_formation_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user" | "investor"
      user_role_type: "startuper" | "mentor" | "investor" | "incubator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "investor"],
      user_role_type: ["startuper", "mentor", "investor", "incubator"],
    },
  },
} as const
