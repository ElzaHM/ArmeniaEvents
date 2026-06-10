create table if not exists public.event_ticket_reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  event_id uuid not null references public.events (id) on delete cascade,
  ticket_code text not null,
  price numeric not null,
  status text not null default 'reserved',
  created_at timestamptz not null default now(),
  constraint event_ticket_reservations_user_event_key unique (user_id, event_id),
  constraint event_ticket_reservations_ticket_code_key unique (ticket_code)
);

create index if not exists event_ticket_reservations_user_id_idx
  on public.event_ticket_reservations (user_id);

create index if not exists event_ticket_reservations_event_id_idx
  on public.event_ticket_reservations (event_id);
