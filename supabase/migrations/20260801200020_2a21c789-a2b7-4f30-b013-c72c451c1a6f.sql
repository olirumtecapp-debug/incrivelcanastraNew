DROP POLICY "Anyone can create rooms" ON public.rooms;
DROP POLICY "Anyone can update rooms" ON public.rooms;
REVOKE INSERT, UPDATE, DELETE ON public.rooms FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_room(p_host_id text, p_host_name text)
RETURNS public.rooms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_room public.rooms;
BEGIN
  IF coalesce(length(p_host_id), 0) < 8 THEN
    RAISE EXCEPTION 'invalid player id';
  END IF;
  LOOP
    v_code := upper(substr(md5(gen_random_uuid()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.rooms WHERE code = v_code);
  END LOOP;

  INSERT INTO public.rooms (code, host_id, host_name)
  VALUES (v_code, p_host_id, coalesce(nullif(left(p_host_name, 24), ''), 'Anfitrião'))
  RETURNING * INTO v_room;

  RETURN v_room;
END;
$$;

CREATE OR REPLACE FUNCTION public.join_room(p_code text, p_guest_id text, p_guest_name text)
RETURNS public.rooms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room public.rooms;
BEGIN
  SELECT * INTO v_room FROM public.rooms WHERE code = upper(p_code);
  IF v_room IS NULL THEN
    RAISE EXCEPTION 'room not found';
  END IF;
  IF v_room.host_id = p_guest_id OR v_room.guest_id = p_guest_id THEN
    RETURN v_room;
  END IF;
  IF v_room.guest_id IS NOT NULL THEN
    RAISE EXCEPTION 'room is full';
  END IF;

  UPDATE public.rooms
  SET guest_id = p_guest_id,
      guest_name = coalesce(nullif(left(p_guest_name, 24), ''), 'Convidado'),
      status = 'ready'
  WHERE id = v_room.id
  RETURNING * INTO v_room;

  RETURN v_room;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_room_state(p_code text, p_player_id text, p_state jsonb, p_status text DEFAULT NULL)
RETURNS public.rooms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room public.rooms;
BEGIN
  SELECT * INTO v_room FROM public.rooms WHERE code = upper(p_code);
  IF v_room IS NULL THEN
    RAISE EXCEPTION 'room not found';
  END IF;
  IF p_player_id IS NULL OR (v_room.host_id <> p_player_id AND coalesce(v_room.guest_id, '') <> p_player_id) THEN
    RAISE EXCEPTION 'not a player of this room';
  END IF;

  UPDATE public.rooms
  SET state = p_state,
      status = coalesce(p_status, status)
  WHERE id = v_room.id
  RETURNING * INTO v_room;

  RETURN v_room;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_room(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.join_room(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_room_state(text, text, jsonb, text) TO anon, authenticated;