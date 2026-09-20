-- Re-escala sleep_quality, mood y soreness_overall de 1-5 a 1-7 (más
-- granularidad, con palabra por nivel en vez de solo número). Mapeo
-- 1->1, 2->3, 3->4, 4->6, 5->7. Respaldar health_checkins antes de correr.
alter table health_checkins drop constraint if exists health_checkins_sleep_quality_check;
alter table health_checkins drop constraint if exists health_checkins_mood_check;
alter table health_checkins drop constraint if exists health_checkins_soreness_overall_check;

update health_checkins set sleep_quality = case sleep_quality
  when 1 then 1 when 2 then 3 when 3 then 4 when 4 then 6 when 5 then 7
  else sleep_quality end
where sleep_quality is not null;

update health_checkins set mood = case mood
  when 1 then 1 when 2 then 3 when 3 then 4 when 4 then 6 when 5 then 7
  else mood end
where mood is not null;

update health_checkins set soreness_overall = case soreness_overall
  when 1 then 1 when 2 then 3 when 3 then 4 when 4 then 6 when 5 then 7
  else soreness_overall end
where soreness_overall is not null;

alter table health_checkins add constraint health_checkins_sleep_quality_check
  check (sleep_quality between 1 and 7);
alter table health_checkins add constraint health_checkins_mood_check
  check (mood between 1 and 7);
alter table health_checkins add constraint health_checkins_soreness_overall_check
  check (soreness_overall between 1 and 7);
