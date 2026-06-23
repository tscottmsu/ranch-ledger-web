alter table public.saddles
add column rider_height_min numeric,
add column rider_height_max numeric,
add column rider_weight_min numeric,
add column rider_weight_max numeric,
add constraint saddles_height_range_check check (rider_height_max is null or rider_height_min is null or rider_height_max >= rider_height_min),
add constraint saddles_weight_range_check check (rider_weight_max is null or rider_weight_min is null or rider_weight_max >= rider_weight_min);

alter table public.guests
add column height_inches numeric;
