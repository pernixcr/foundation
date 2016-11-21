(function () {

    'use strict';

    angular.module('StaffApp')
        .service('documentService', function ($http, $q, $cookies, Upload) {

            this.csrf_token = function () {
                return $cookies.csrftoken;
            };

            /**
             * WIP
             * Upload one or multiple documentation
             * @param files
             * @param logs
             */
            this.uploadDocument = function (files, logs, author) {
                if (files && files.length) {
                    for (var i = 0; i < files.length; i++) {
                        logs[i] = {
                            status: '',
                            progress: 0,
                            documentId: null
                        };
                        var file = files[i];
                        if (!file.$error) {
                            Upload.upload({
                                url: '/docs/upload_document',
                                data: {
                                    author: author,    // File owner
                                    file: file,  // File itsefl
                                    fileId: i  // using to reference progress and upload status
                                },
                                headers: {
                                    'X-CSRFToken': $cookies.csrftoken
                                }
                            }).then(function (resp) {
                                logs[resp.config.data.fileId].status = "Upload success";
                                logs[resp.config.data.fileId].document = resp.data.document;
                            }, function (resp) {
                                logs[resp.config.data.fileId].status = "Upload failed";
                            }, function (evt) {
                                logs[evt.config.data.fileId].progress = parseInt(100.0 *
                                    evt.loaded / evt.total);
                            });
                        }
                    }
                }

            };


            /**
             * Get list of document user have uploaded
             */
            this.getUploadedDocument = function () {
                return $http.get('/docs/list');
            };

            /**
             * @param documentId
             */
            this.getDocumentInfo = function (documentId) {
                return $http.get('/docs/info/' + documentId);
            };

            /**
             * WIP
             */
            this.typeaheadPatientList = function () {

            };

            /**
             * WIP
             */
            this.pinDocument2Todo = function () {

            };

            /**
             * WIP
             */
            this.pinDocument2Problem = function () {

            };
        });

})();