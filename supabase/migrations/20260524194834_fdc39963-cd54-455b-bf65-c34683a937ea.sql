
-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Helper to safely insert notification
CREATE OR REPLACE FUNCTION public.create_notification(_user_id uuid, _type text, _title text, _message text, _link text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, type, title, message, link)
  VALUES (_user_id, _type, _title, _message, _link);
END;
$$;

-- Mentor sessions: notify both sides on create/status change
CREATE OR REPLACE FUNCTION public.notify_mentor_session()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  mentor_user uuid;
  mentor_name text;
BEGIN
  SELECT user_id, full_name INTO mentor_user, mentor_name FROM mentors WHERE id = NEW.mentor_id;
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notification(mentor_user, 'mentor_booking',
      'Nouvelle demande de session', 'Une startup a réservé une session avec vous.', '/coach-dashboard');
    PERFORM create_notification(NEW.startup_user_id, 'mentor_booking',
      'Session demandée', 'Votre demande à ' || COALESCE(mentor_name,'votre mentor') || ' est en attente.', '/mentors');
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'confirmed' THEN
      PERFORM create_notification(NEW.startup_user_id, 'mentor_confirmed',
        'Session confirmée', 'Votre session avec ' || COALESCE(mentor_name,'le mentor') || ' est confirmée.', '/mentors');
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM create_notification(NEW.startup_user_id, 'mentor_cancelled',
        'Session annulée', 'Une session a été annulée.', '/mentors');
      PERFORM create_notification(mentor_user, 'mentor_cancelled',
        'Session annulée', 'Une session a été annulée.', '/coach-dashboard');
    ELSIF NEW.status = 'completed' THEN
      PERFORM create_notification(NEW.startup_user_id, 'mentor_completed',
        'Session complétée', 'Pensez à laisser un avis à votre mentor.', '/mentors');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_mentor_session ON public.mentor_sessions;
CREATE TRIGGER trg_notify_mentor_session
AFTER INSERT OR UPDATE ON public.mentor_sessions
FOR EACH ROW EXECUTE FUNCTION public.notify_mentor_session();

-- Community comments: notify post author
CREATE OR REPLACE FUNCTION public.notify_post_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_id uuid;
  commenter_name text;
BEGIN
  SELECT user_id INTO author_id FROM community_posts WHERE id = NEW.post_id;
  IF author_id IS NULL OR author_id = NEW.user_id THEN RETURN NEW; END IF;
  SELECT full_name INTO commenter_name FROM profiles WHERE user_id = NEW.user_id;
  PERFORM create_notification(author_id, 'post_comment',
    'Nouveau commentaire',
    COALESCE(commenter_name,'Un membre') || ' a commenté votre publication.',
    '/feed');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_post_comment ON public.community_post_comments;
CREATE TRIGGER trg_notify_post_comment
AFTER INSERT ON public.community_post_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_post_comment();

-- Funding application status change
CREATE OR REPLACE FUNCTION public.notify_funding_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM create_notification(NEW.user_id, 'funding_status',
      'Candidature mise à jour',
      'Statut passé à : ' || NEW.status,
      '/candidatures');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_funding_status ON public.funding_applications;
CREATE TRIGGER trg_notify_funding_status
AFTER UPDATE ON public.funding_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_funding_status();

-- Badge earned
CREATE OR REPLACE FUNCTION public.notify_badge_earned()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM create_notification(NEW.user_id, 'badge_earned',
    'Nouveau badge débloqué 🏆',
    COALESCE(NEW.label, NEW.badge_code),
    '/roadmap');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_badge_earned ON public.journey_badges;
CREATE TRIGGER trg_notify_badge_earned
AFTER INSERT ON public.journey_badges
FOR EACH ROW EXECUTE FUNCTION public.notify_badge_earned();
