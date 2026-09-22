-- Amplia los tipos de plan de entrenamiento (antes solo gym/bike/sailing/other)
update events set plan_type = 'cycling' where plan_type = 'bike';
update events set plan_type = null where plan_type = 'other';

alter table events drop constraint if exists events_plan_type_check;
alter table events add constraint events_plan_type_check
  check (plan_type in (
    'running','cycling','swimming','gym','mobility',
    'yoga','hiking','rowing','surf','sailing'
  ));
