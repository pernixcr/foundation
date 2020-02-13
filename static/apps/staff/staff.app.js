/**
 * Copyright (c) Small Brain Records 2014-2018 Kevin Perdue, James Ryan with contributors Timothy Clemens and Dinh Ngoc Anh
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function () {

    'use strict';


    var StaffApp = angular.module('StaffApp', ['ngRoute', 'ngCookies', 'ngDialog', 'ngAnimate', 'ngSanitize', // Core module along with angularJS
        'app.services',
        'sharedModule', 'httpModule', 'myTools', 'inr', 'todos', 'document', 'TemplateCache',  // Development module

        'toaster', 'ngFileUpload', 'dndLists', 'ui.sortable', 'angular-spinkit', '720kb.datepicker',// 3rd party module
        'ui.bootstrap', 'pickadate', 'cgPrompt', 'view.file', 'angularMoment', 'checklist-model']);


    StaffApp.config(function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $routeProvider
            .when('/', {
                templateUrl: '/static/apps/staff/partials/home.template.html',
                controller: 'HomeCtrl'
            })
            .when('/manage/setting', {
                templateUrl: '/static/apps/staff/setting-page/setting-page.html',
                controller: 'SettingPageController'
            })
            .when("/todo/:todo_id", {
                templateUrl: '/static/apps/staff/partials/staff-todo-page.template.html',
                controller: 'TodoCtrl'
            })
            .when('/manage/sharing', {

                templateUrl: '/static/apps/admin/manage-sharing-page/manage-sharing.html',
                controller: 'ManageSharingCtrl'
            })
            .when('/manage/sharing/:patientId', {

                templateUrl: '/static/apps/common/directives/patient_sharing/manage_sharing_patient.html',
                controller: 'ManageSharingPatientCtrl'
            })
            .when('/manage/sharing/problem/:patientId/:sharing_patient_id', {

                templateUrl: '/static/apps/admin/manage-sharing-problem/manage-sharing-problem.html',
                controller: 'ManageSharingProblemCtrl'
            })
            .when('/manage/common_problems', {

                templateUrl: '/static/apps/staff/partials/problem-common.template.html',
                controller: 'ManageCommonProblemCtrl'
            })
            .when('/manage/upload_documents', {
                templateUrl: '/static/apps/common/directives/document/document-upload-page.template.html',
                controller: 'UploadDocumentsCtrl'
            })
            .when('/manage/uploaded', {
                templateUrl: '/static/apps/common/directives/document/document-uploaded-page.template.html',
                controller: 'UploadedDocumentsPageCtrl'
            })
            .when('/manage/document/:documentId', {
                templateUrl: '/static/apps/common/directives/document/document-page.template.html',
                controller: 'ViewDocumentCtrl'
            }).otherwise('/');
    });
})();
