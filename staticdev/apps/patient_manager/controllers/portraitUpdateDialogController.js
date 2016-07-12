(function () {

    'use strict';


    angular.module('ManagerApp')
        .controller('PortraitUpdCtrl', ['$scope', 'patientService', function ($scope, patientService) {
            // METHOD 1: User select an image from their computer
            /**
             * Handler when user select file from computer
             * @param file
             */
            $scope.file_changed = function (file) {
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    $scope.preview_image_src = reader.result;
                    $scope.photo_is_taken_flag = false;
                    $scope.get_image_via_camera_flag = false;
                    $scope.$apply();
                }, false);

                if (file[0]) {
                    reader.readAsDataURL(file[0]);
                }
            };

            // METHOD 2: User select take an image from integrate camera
            $scope.photo_is_taken_flag = false;
            $scope.get_image_via_camera_flag = false;
            var _video = null;
            $scope.channel = {};
            $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};

            /**
             *
             */
            $scope.reset_take_photo_flags = function () {
                $scope.photo_is_taken_flag = false;
                $scope.get_image_via_camera_flag = true;
                $scope.preview_image_src = null;
            };

            /**
             * Get video data
             * @param x
             * @param y
             * @param w
             * @param h
             * @returns {ImageData}
             */
            $scope.getVideoData = function (x, y, w, h) {
                var hiddenCanvas = document.createElement('canvas');
                hiddenCanvas.width = _video.width;
                hiddenCanvas.height = _video.height;
                var ctx = hiddenCanvas.getContext('2d');
                ctx.drawImage(_video, 0, 0, _video.width, _video.height);
                return ctx.getImageData(x, y, w, h);
            };

            /**
             * Callback if there is any error when getting user camera access
             * @param err
             */
            $scope.onError = function (err) {
                $scope.$apply(function () {
                        $scope.webcamError = err;
                    }
                );
            };

            /**
             * Callback when success initialize camera
             */
            $scope.onSuccess = function () {
                // The video element contains the captured camera data
                _video = $scope.channel.video;
                $scope.$apply(function () {
                    $scope.patOpts.w = _video.width;
                    $scope.patOpts.h = _video.height;
                    $scope.showDemos = true;
                });
            };

            /**
             * Take a snap shot from video
             * Close camera preview
             * Set image preview
             * TODO: Revoke video access
             *
             */
            $scope.take_snapshot = function () {
                if (_video) {
                    // Flag to determine photo is taken or not
                    $scope.get_image_via_camera_flag = false;
                    $scope.photo_is_taken_flag = true;
                    var patCanvas = document.querySelector('#snapshot');
                    if (!patCanvas) return;

                    patCanvas.width = _video.width;
                    patCanvas.height = _video.height;
                    var ctxPat = patCanvas.getContext('2d');
                    var idata = $scope.getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
                    ctxPat.putImageData(idata, 0, 0);

                    $scope.preview_image_src = patCanvas.toDataURL();
                }
            };


            /**
             * TODO: Wait 4 submit form
             * Upload selected file to server then replace
             */
            $scope.submit_form = function () {
                console.log("Form data will be submitted here");
            };

        }]);
})();