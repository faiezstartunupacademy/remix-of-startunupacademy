INSERT INTO public.user_roles (user_id, role)
VALUES ('cf91eafc-c24d-409d-834c-9770a76f60f6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;