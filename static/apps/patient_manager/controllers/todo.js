(function(){

	'use strict';


	angular.module('ManagerApp')
		.controller('TodoCtrl', function($scope, $routeParams, $interval, patientService, ngDialog, todoService, toaster){

			var patient_id = $('#patient_id').val();
			$scope.patient_id = patient_id;
            var user_id = $('#user_id').val();
            $scope.user_id = user_id;
			var todo_id = $routeParams.todo_id;
            $scope.loading = true;

			$scope.todo_id = todo_id;
            $scope.current_activity = 0;

			todoService.fetchTodoInfo(todo_id).then(function(data){
                $scope.todo = data['info'];
                $scope.comments = data['comments'];
                $scope.attachments = data['attachments'];
                $scope.related_encounters = data['related_encounters'];
                $scope.activities = data['activities'];
                if (data['activities'].length) {
                    $scope.current_activity = data['activities'][0].id;
                }
                $interval(function(){
                    $scope.refresh_todo_activity();
                }, 10000);

                $scope.sharing_patients = data['sharing_patients'];
                $scope.loading = false;
            });

            patientService.fetchActiveUser().then(function(data){
				$scope.active_user = data['user_profile'];
			});

			todoService.addTodoAccessEncounter(todo_id).then(function() {});

            todoService.fetchTodoMembers($scope.patient_id).then(function(data){
                $scope.members = data['members'];
            });

            todoService.fetchLabels($scope.patient_id).then(function(data){
                $scope.labels = data['labels'];
            });

            $scope.isDueDate = function(date) {
                var date = new Date(date);
                var today = new Date();
                if (date < today) {
                    return 'due-date';
                }
                return '';
            }


            // add comment
            $scope.add_comment = function(form) {
            	form.todo_id = $scope.todo_id;

				todoService.addComment(form).then(function(data){
					var comment = data['comment'];
					$scope.comments.push(comment);

					$scope.new_comment = {};
					toaster.pop('success', 'Done', 'New Comment added successfully');
				});
            }

            // edit comment
            $scope.toggleEditComment = function(comment) {
            	comment.edit = true;
            }

            $scope.toggleSaveComment = function(comment) {

				todoService.editComment(comment).then(function(data){
					comment.datetime = data['comment']['datetime'];
					comment.edit = false;
					toaster.pop('success', 'Done', 'Edited comment successfully');
				});
            	
            }

            // delete comment
            $scope.delete = function(comment) {
            	$scope.currentComment = comment;
            	angular.element('#deleteCommentModal').modal();
            }

            $scope.confirmDelete = function(currentComment) {
            	todoService.deleteComment(currentComment).then(function(data){
					var index = $scope.comments.indexOf(currentComment);
					$scope.comments.splice(index, 1);
					angular.element('#deleteCommentModal').modal('hide');
					toaster.pop('success', 'Done', 'Deleted comment successfully');
				});
            }

            // change todo text
            $scope.changeText = function(todo) {
                todo.change_text = (todo.change_text != true) ? true : false;
            }

            $scope.saveTodoText = function(todo) {
                todoService.changeTodoText(todo).then(function(data){
                    if(data['success']==true){
                        toaster.pop('success', "Done", "Updated Todo text!");
                    }else{
                        toaster.pop('error', 'Error', 'Something went wrong, we are fixing it asap!');
                    }
                });
            }

            // update status
            $scope.update_todo_status = function(todo){
                patientService.updateTodoStatus(todo).then(function(data){
                    if(data['success']==true){
                        toaster.pop('success', "Done", "Updated Todo status !");
                    }else{
                        toaster.pop('error', 'Warning', 'Something went wrong!');
                    }
                });             

            }

            // change label
            // label
            $scope.labels_component = [
                {name: 'green', css_class: 'todo-label-green'},
                {name: 'yellow', css_class: 'todo-label-yellow'},
                {name: 'orange', css_class: 'todo-label-orange'},
                {name: 'red', css_class: 'todo-label-red'},
                {name: 'purple', css_class: 'todo-label-purple'},
                {name: 'blue', css_class: 'todo-label-blue'},
                {name: 'sky', css_class: 'todo-label-sky'},
            ];
            $scope.label_component = {};

            $scope.createLabel = function(todo) {
                todo.create_label = (todo.create_label != true) ? true : false;
            }

            $scope.createLabel2 = function(todo) {
                todo.create_label2 = (todo.create_label2 != true) ? true : false;
            }

            $scope.selectLabelComponent = function(component) {
                $scope.label_component.css_class = component.css_class;
            }

            $scope.saveCreateLabel = function(todo) {
                $scope.label_component.is_all = null;
                if ($scope.label_component.css_class != null) {
                    todoService.saveCreateLabel(todo.id, $scope.label_component).then(function(data){
                        if(data['success']==true){
                            if(data['new_status']==true){
                                $scope.labels.push(data['new_label']);
                            }
                            if(data['status']==true){
                                todo.labels.push(data['label']);
                                toaster.pop('success', "Done", "Added Todo label!");
                            }
                        }else{
                            toaster.pop('error', 'Warning', 'Something went wrong!');
                        }
                    });
                }
                todo.create_label = false;
                todo.create_label2 = false;
            }

            $scope.saveCreateLabelAll = function(todo) {
                $scope.label_component.is_all = true;
                if ($scope.label_component.css_class != null) {
                    todoService.saveCreateLabel(todo.id, $scope.label_component).then(function(data){
                        if(data['success']==true){
                            if(data['new_status']==true){
                                $scope.labels.push(data['new_label']);
                            }
                            if(data['status']==true){
                                todo.labels.push(data['label']);
                                toaster.pop('success', "Done", "Added Todo label!");
                            }
                        }else{
                            toaster.pop('error', 'Warning', 'Something went wrong!');
                        }
                    });
                }
                todo.create_label = false;
                todo.create_label2 = false;
            }

            $scope.editLabel = function(label) {
                label.edit_label = (label.edit_label != true) ? true : false;
            }

            $scope.selectEditLabelComponent = function(label, component) {
                label.css_class = component.css_class;
            }

            $scope.saveEditLabel = function(label) {
                if (label.css_class != null) {
                    todoService.saveEditLabel(label).then(function(data){
                        if(data['success']==true){
                            label.css_class = data['label']['css_class'];
                            if(data['status']==true){
                                angular.forEach($scope.todo.labels, function(value, key2) {
                                    if (value.id == label.id) {
                                        value.css_class = label.css_class;
                                    }
                                });
                                toaster.pop('success', "Done", "Changed label!");
                            }
                        }else{
                            toaster.pop('error', 'Warning', 'Something went wrong!');
                        }
                    });
                }
                label.edit_label = false;
            }

            $scope.deleteEditLabel = function(label) {
                $scope.currentLabel = label;
                angular.element('#deleteLabelModal').modal();
            }

            $scope.confirmDeleteLabel = function(currentLabel) {
                todoService.deleteLabel(currentLabel).then(function(data){
                    var index = $scope.labels.indexOf(currentLabel);
                    $scope.labels.splice(index, 1);
                    var index2;
                    angular.forEach($scope.todo.labels, function(value, key) {
                        if (value.id == currentLabel.id) {
                            index2 = key;
                        }
                    });
                    if (index2 != undefined)
                        $scope.todo.labels.splice(index2, 1);
                    angular.element('#deleteLabelModal').modal('hide');
                    toaster.pop('success', 'Done', 'Deleted label successfully');
                });
            }

            $scope.changeLabel = function(todo) {
                todo.change_label = (todo.change_label != true) ? true : false;
            }

            $scope.changeLabel2 = function(todo) {
                todo.change_label2 = (todo.change_label2 != true) ? true : false;
            }

            $scope.changeTodoLabel = function(todo, label) {

                var is_existed = false;
                var existed_key;
                var existed_id;

                angular.forEach(todo.labels, function(value, key) {
                    if (value.id==label.id) {
                        is_existed = true;
                        existed_key = key;
                        existed_id = value.id;
                    }
                });
                if (!is_existed) {
                    todo.labels.push(label);
                    todoService.addTodoLabel(label.id, todo.id).then(function(data){
                        if(data['success']==true){
                            toaster.pop('success', "Done", "Added Todo label!");
                        }else{
                            toaster.pop('error', 'Error', 'Something went wrong, we are fixing it asap!');
                        }
                    });
                } else {
                    todo.labels.splice(existed_key, 1);
                    todoService.removeTodoLabel(existed_id, todo.id).then(function(data){
                        if(data['success']==true){
                            toaster.pop('success', "Done", "Removed Todo label!");
                        }else{
                        	toaster.pop('error', 'Error', 'Something went wrong, we are fixing it asap!');
                        }
                    });
                }
                
            }

            // change due date
            $scope.changeDueDate = function(todo) {
                todo.change_due_date = (todo.change_due_date != true) ? true : false;
            }

            $scope.changeDueDate2 = function(todo) {
                todo.change_due_date2 = (todo.change_due_date2 != true) ? true : false;
            }

            $scope.allowDueDateNotification = true;
            $scope.saveTodoDueDate = function(todo) {
                todoService.changeTodoDueDate(todo).then(function(data){
                    if(data['success']==true){
                        if ($scope.allowDueDateNotification)
                            toaster.pop('success', "Done", "Due date Updated!");
                        $scope.allowDueDateNotification = true;
                    }else if(data['success']==false){
                        todo.due_date = data['todo']['due_date'];
                        toaster.pop('error', 'Error', 'Invalid date format');
                        $scope.allowDueDateNotification = false;
                    }else{
                        toaster.pop('error', 'Error', 'Something went wrong, we are fixing it asap!');
                    }
                });
            }

            // Attachment
            $scope.changeAttachment = function(todo) {
                todo.change_attachment = (todo.change_attachment != true) ? true : false;
            }

            $scope.addAttachment = function(todo, attachment) {
            	var form = {};
				form.todo_id = $scope.todo_id;

				todoService.addAttachment(form, attachment).then(function(data){
					if(data['success']==true){
						toaster.pop('success', 'Done', 'Attachment uploaded!');
						var attachment = data['attachment'];
						console.log($scope.attachments);
						$scope.attachments.push(attachment);
					}else if(data['success']==false){
						toaster.pop('error', 'Error', 'Please fill valid data');
					}else{
						toaster.pop('error', 'Error', 'Something went wrong, we are fixing it asap!');
					}
					todo.change_attachment = false
				});
            }

            // delete Attachment
            $scope.deleteAttachment = function(attachment) {
                $scope.currentAttachment = attachment;
                angular.element('#deleteAttachmentModal').modal();
            }

            $scope.confirmDeleteAttachment = function(currentAttachment) {
                todoService.deleteAttachment(currentAttachment).then(function(data){
                    var index = $scope.attachments.indexOf(currentAttachment);
                    $scope.attachments.splice(index, 1);
                    angular.element('#deleteAttachmentModal').modal('hide');
                    toaster.pop('success', 'Done', 'Deleted attachment successfully');
                });
            }

            // add member
            $scope.changeMember = function(todo) {
                todo.change_member = (todo.change_member != true) ? true : false;
            }

            $scope.changeMember2 = function(todo) {
                todo.change_member2 = (todo.change_member2 != true) ? true : false;
            }

            $scope.changeTodoMember = function(todo, member) {

                var is_existed = false;
                var existed_key;
                var existed_id;

                angular.forEach(todo.members, function(value, key) {
                    if (value.id==member.id) {
                        is_existed = true;
                        existed_key = key;
                        existed_id = value.id;
                    }
                });
                if (!is_existed) {
                    todo.members.push(member);
                    todoService.addTodoMember(todo, member).then(function(data){
                        if(data['success']==true){
                            toaster.pop('success', "Done", "Added member!");
                        }else{
                            toaster.pop('error', 'Warning', 'Something went wrong!');
                        }
                    });
                } else {
                    todo.members.splice(existed_key, 1);
                    todoService.removeTodoMember(todo, member).then(function(data){
                        if(data['success']==true){
                            toaster.pop('success', "Done", "Removed member!");
                        }else{
                            toaster.pop('error', 'Warning', 'Something went wrong!');
                        }
                    });
                }
                
            }

            $scope.refresh_todo_activity=function(){
                todoService.getTodoActivity($scope.todo_id, $scope.current_activity).then(function(data){
                    if (data != null) {
                        if (data['activities'].length) {
                            for (var i=data['activities'].length-1; i>=0; i--){
                                $scope.activities.unshift(data['activities'][i]);
                            }
                            $scope.current_activity = data['activities'][0].id;
                        }
                    }
                })
            }

            $scope.isInArray = function(array, item) {
                var is_existed = false;
                angular.forEach(array, function(value, key2) {
                    if (value == item) {
                        is_existed = true;
                    }
                });
                return is_existed;
            };

            // check sharing problem
            $scope.checkSharedProblem = function(problem, sharing_patients) {
                if ($scope.patient_id == $scope.user_id || $scope.active_user.role != 'patient') {
                    return true;
                } else {
                    var is_existed = false;
                    angular.forEach(sharing_patients, function(p, key) {
                        if (!is_existed && p.user.id == $scope.user_id) {
                            is_existed = $scope.isInArray(p.problems, problem.id);
                        }
                    });

                    return is_existed;
                }
            };

		}); /* End of controller */


})();