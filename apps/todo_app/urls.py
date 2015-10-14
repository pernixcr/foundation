from django.conf.urls import patterns, include, url


urlpatterns = patterns('todo_app.views',

    url(r'^patient/(?P<patient_id>\d+)/todos/add/new_todo$', 'add_patient_todo'),

    url(r'^todo/(?P<todo_id>\d+)/update/$', 'update_todo_status'),

	)