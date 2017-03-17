(function() {
    'use strict';

    angular
        .module('fct.core')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope', 'memberService', '$window'];

    function DashboardController($rootScope, memberService, $window) {
        var vm = this;

        angular.extend(vm, {
            getVFS: getVFS,
            getUVF: getUVF
        });

        activate();

        function activate() {
            getVFS();
            getUVF();
            // getUnconfirmedRegistration();
        }

        function getVFS() {
            return memberService.getVerifyFacultyStudent()
                .then(function(response) {
                    vm.VFSPath = response.data.path;
                    // $window.open(response.data.path);
                    //console.log(response);
                })
                .catch(function(error) {
                    //console.log(error);
                });
        }

        function getUVF() {
            return memberService.getUnverifiedFaculty()
                .then(function(response) {
                    vm.UVFPath = response.data.path;
                    // $window.open(response.data.path);
                    //console.log(response);
                })
                .catch(function(error) {
                    //console.log(error);
                });
        }

        // function getUnconfirmedRegistration() {
        //     return memberService.getUnconfirmedRegistration()
        //
        //         .then(function(response) {
        //             console.log(reponse);
        //         })
        //         .catch(function(error) { //console.log(error);
        //         });
        // }
    }
})();
// return memberService.getUnverifiedFaculty()
//     .then(function(response) {
//         vm.UVFPath = response.data.path;
//         // $window.open(response.data.path);
//         //console.log(response);
//     })
//     .catch(function(error) {
//         //console.log(error);
//     });
// }
//
// function getUnconfirmedRegistration() {
//     return memberService.getUnconfirmedRegistration()
//         .then(function(response) {
//             console.log(reponse);
//         })
//         .catch(function(error) {
//             //console.log(error);
//         });
// }
// }
// })();
// // $window.open(response.data.path);
// //console.log(response);
// })
// .catch(function(error) {
//         .catch(function(error) {
//             //console.log(error);
//         });
//     }
//
//     function getUnconfirmedRegistration() {
//         return memberService.getUnconfirmedRegistration()
//
//             .then(function(response) {
//                 console.log(reponse);
//             })
//             .catch(function(error) {
//                     .then(function(response) {
//                             console.log(reponse);
//                         })
//                         .catch(function(error) { //console.log(error);
//                         });
//                 }
//             }
//     })();
