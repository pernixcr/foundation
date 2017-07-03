(function () {

    'use strict';


    angular.module('TemplateCache', [])
        .run(function ($templateCache) {
            $templateCache.put('bleedingRiskDialog',
                "<div><p  class='text-center'>This patient is on Warfarin, will this affect the patient's bleeding risk?</p>" +
                "<div class='ngdialog-buttons text-right'>" +
                "<button class='btn btn-primary' ng-click='closeThisDialog()'>Thank you</button>" +
                "</div></div>");
            $templateCache.put('askDueDateDialog',
                '<div class="row" ng-keypress="$event.which === 13 && vm.dueDateIsValid() && closeThisDialog(vm.dueDate)">' +
                '<div class="col-md-12"><p>Enter due date</p><input class="form-control" auto-focus type="text" ng-model="vm.dueDate" title="Due date" placeholder="Enter a due date"></div>' +
                '<div class="col-md-12 text-right ngdialog-buttons"><br>' +
                '<button class="btn btn-primary"  ng-click="vm.dueDateIsValid() && closeThisDialog(vm.dueDate)">Ok</button>' +
                '<button class="btn btn-danger" ng-click="closeThisDialog()">Add todo without a due date</button>' +
                '</div></div>');
            $templateCache.put('postAddTodoDialog', '<div ng-if="vm.step== 0" class="row">        <div class="col-md-12">            <p>Enter a due date(Leave empty if don\'t have a due date)</p>            <input class="form-control" auto-focus type="text" title="Due date" placeholder="Enter a due date"                   ng-model="vm.form.dueDate" ng-keyup="vm.dueDateValidation()">            <i class="hint">Valid input format: MM/DD/YYYY, M/D/YYYY, MM/YYYY, M/YYYY, MM/DD/YY, M/D/YY, MM/YY, M/YY</i>        </div>        <div class="col-md-12 ngdialog-buttons">            <button class="btn btn-primary pull-right" ng-click="vm.step=1" ng-disabled="!vm.dueDateIsValid">                Tag member            </button>        </div>    </div>    <div ng-if="vm.step == 1" class="row">        <div class="col-md-12">            <p>Tag member to this todo</p>            <input type="text" class="form-control member-search-box" ng-model="vm.memberSearch"                   title="Search members" placeholder="Search members"/>            <a ng-repeat="member in vm.memberList | filter : vm.memberFilter"               href class="member-tagging"               ng-click="vm.toggleTaggedMember(member)">                <span class="full-name">{{member.user.first_name}} {{member.user.last_name}}</span>                <i class="fa fa-check pull-right" ng-if="vm.form.taggedMembers.indexOf(member.id) != -1"></i>            </a>        </div>        <div class="col-md-12 ngdialog-buttons">            <button class="btn btn-default pull-left" ng-click="vm.step=0">Change due date</button>            <button class="btn btn-primary pull-right" ng-click="closeThisDialog(vm.form)">Submit</button>        </div>    </div>');
            $templateCache.put('todoPopupConfirmDialog',
                "<div class='ngdialog-buttons text-right'>" +
                "<button class='btn btn-primary' ng-click='closeThisDialog(true)'>Yes, mark this todo as accomplished?</button> " +
                "<button class='btn btn-danger' ng-click='closeThisDialog()'>No, don't mark this todo as accomplished</button>" +
                "</div>");
            $templateCache.put('documentConfirmDialog', "<div class='text-center'><p>This is a permanent deletion</p><div class='ngdialog-buttons text-right'><button class='btn btn-danger' ng-click='closeThisDialog(true)'>Yes delete</button><button class='btn btn-primary' ng-click='closeThisDialog(false)'>No do not delete</button></div></div>");
            $templateCache.put('reSubmitConfirmDialog',
                "<div><p  class='text-center'>You have already entered the vitals. Are you sure you want to enter them again</p>" +
                "<div class='ngdialog-buttons text-right'><button class='btn btn-danger' ng-click='confirm()'>Yes</button>" +
                "<button class='btn btn-primary' ng-click='closeThisDialog()'>No</button>" +
                "</div></div>");
        });
})();
