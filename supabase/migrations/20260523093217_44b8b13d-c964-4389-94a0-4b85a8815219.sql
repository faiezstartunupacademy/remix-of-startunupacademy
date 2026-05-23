
DROP FUNCTION IF EXISTS public.get_safe_forum_threads();

CREATE OR REPLACE FUNCTION public.get_safe_forum_threads()
 RETURNS TABLE(id uuid, title text, content text, category text, user_id uuid, is_pinned boolean, replies_count integer, created_at timestamp with time zone, updated_at timestamp with time zone, trainer_name text, trainer_email text, meet_link text, scheduled_date timestamp with time zone, duration_text text, formation_plan text, min_participants integer, max_participants integer, objectives text, is_strategic boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    ft.id, ft.title, ft.content, ft.category, ft.user_id,
    ft.is_pinned, ft.replies_count, ft.created_at, ft.updated_at,
    ft.trainer_name,
    CASE WHEN has_role(auth.uid(), 'admin') THEN ft.trainer_email ELSE NULL END,
    ft.meet_link, ft.scheduled_date, ft.duration_text, ft.formation_plan,
    ft.min_participants, ft.max_participants, ft.objectives, ft.is_strategic
  FROM forum_threads ft
  ORDER BY ft.is_pinned DESC, ft.updated_at DESC;
END;
$function$;
