(function () {

    'use strict';

    angular.module('sharedModule', ['ngFileUpload', 'httpModule', 'cfp.hotkeys'])
        .config(function ($httpProvider) {
            $httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        })
        .service('sharedService', sharedService);

    sharedService.$inject = ['$http', '$cookies', 'Upload', 'hotkeys', '$location', 'httpService'];

    function sharedService($http, $cookies, Upload, hotkeys, $location, httpService) {
        return {
            settings: {},
            uploadDocument: uploadDocument,
            deleteDocumentTag: deleteDocumentTag,
            pinLabelToDocument: pinLabelToDocument,
            unpinDocumentLabel: unpinDocumentLabel,
            unpinDocumentProblem: unpinDocumentProblem,
            unpinDocumentTodo: unpinDocumentTodo,
            getDocumentInfo: getDocumentInfo,
            removeDocument: removeDocument,
            getUploadedDocument: getUploadedDocument,
            getSettings: getSettings,
            updateSettings: updateSettings,
            fetchPatientInfo: fetchPatientInfo,
            fetchActiveUser: fetchActiveUser,
            fetchPatientTodos: fetchPatientTodos,
            fetchProblems: fetchProblems,
            addToDo: addToDo,
            addProblem: addProblem
        };

        /**
         * Upload multiple documentation
         * @param files
         * @param author
         * @param patient
         * @param callback
         */
        function uploadDocument(files, author, patient, callback) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: '/docs/upload_document',
                            data: {
                                author: author,     // File owner
                                patient: patient,   // Primary pinned patient
                                file: file          // File itself
                            },
                            headers: {
                                'X-CSRFToken': $cookies.get('csrftoken')
                            }
                        }).then(function (resp) {
                            callback(resp);
                        }, function (resp) {
                        }, function (evt) {
                        });
                    }
                }
            }
        }

        /**
         *
         * @param document      Id of document will be delete
         * @param tag_id        Id of tag item will be deleted
         * @param tag_type      Type of tagging document 'problem' or 'todo'
         * @param del_in_sys    Flag indicate will file be deleted in system or not
         */
        function deleteDocumentTag(document, tag_id, tag_type, del_in_sys) {
            del_in_sys = del_in_sys == undefined ? false : del_in_sys;
            return $http.post('/docs/delete/' + document.id, {
                'document': document.id,
                'del_tag_id': tag_id.id,
                'del_tag_type': tag_type,
                'del_in_sys': del_in_sys
            }, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            })
        }

        /**
         * Add a label to document
         * @param document
         * @param label
         */
        function pinLabelToDocument(document, label) {
            return $http.post('/docs/pin/label', {
                document: document.id,
                label: label.id
            }, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        /**
         * Remove a label in document
         * @param document
         * @param label
         */
        function unpinDocumentLabel(document, label) {
            return $http.post('/docs/remove/label', {
                document: document.id,
                label: label.id
            }, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        /**
         * Remove an pinned problem in document
         * @param document
         * @param problem
         */
        function unpinDocumentProblem(document, problem) {
            return $http.post('/docs/unpin/problem', {
                document: document.id,
                problem: problem.id
            }, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        /**
         * Remove an pinned todo in document
         * @param document
         * @param todo
         */
        function unpinDocumentTodo(document, todo) {
            return $http.post('/docs/unpin/todo', {
                document: document.id,
                todo: todo.id
            }, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        /**
         *
         * @param documentId
         */
        function getDocumentInfo(documentId) {
            return $http.get('/docs/info/' + documentId);
        }

        /**
         *
         * @param document
         */
        function removeDocument(document) {
            return $http.post('/docs/remove/' + document.id, null, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        /**
         * Get list of document user have uploaded
         */
        function getUploadedDocument() {
            return $http.get('/docs/list');
        }

        function getSettings() {
            return $http.get('/u/setting');
        }

        function updateSettings(settingObj) {
            return $http.post('/u/update_setting', settingObj, {
                headers: {
                    'X-CSRFToken': $cookies.get('csrftoken')
                }
            });
        }

        function fetchPatientInfo(patient_id) {
            var url = '/u/patient/' + patient_id + '/info';

            return $http.get(url);

        }

        function fetchActiveUser() {
            var url = '/u/active/user/';
            return $http.get(url);
        }

        function fetchPatientTodos(patient_id) {
            var url = '/u/patient/' + patient_id + '/patient_todos_info';

            return $http.get(url);

        }

        function fetchProblems(patient_id) {
            var url = '/p/problem/' + patient_id + '/getproblems';
            return $http.get(url);
        }

        function addToDo(form) {

            var url = '/todo/patient/' + form.patient_id + '/todos/add/new_todo';

            return httpService.post(form, url);


        }


        function addProblem(form) {

            var url = '/p/patient/' + form.patient_id + '/problems/add/new_problem';

            return httpService.post(form, url);


        }
    }
})();
