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

    angular.module('ManagerApp')
        .directive('encounterEvent', encounterEvent);

    encounterEvent.$inject = ['patientService'];

    function encounterEvent(patientService) {
        return {
            restrict: 'A',
            link: fnLink
        };

        function fnLink($scope, $element, $attrs) {
            console.log($scope.patient_id);
            $element.click(() => {
                let form = {
                    patient_id: $scope.patient_id,
                    tab_id: $attrs.tabId
                };
                patientService.trackTabClickEvent(form);
            });
        }
    }
})();