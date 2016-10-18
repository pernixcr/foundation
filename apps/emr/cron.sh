#!/bin/bash
cd /home/softdevelop_vd
workon foundation
cd foundation
python manage.py cron review_colorectal_cancer_risk_assessment
python manage.py cron patient_needs_a_plan_for_colorectal_cancer_screening
python manage.py cron a1c_order_was_automatically_generated
python manage.py cron physician_adds_the_same_data_to_the_same_problem_concept_id_more_than_3_times
python manage.py cron physician_adds_the_same_medication_to_the_same_problem_concept_id_more_than_3_times