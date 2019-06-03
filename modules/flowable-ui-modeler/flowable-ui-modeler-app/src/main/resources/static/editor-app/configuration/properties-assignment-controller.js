/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Assignment
 */
'use strict';

angular.module('flowableModeler').controller('FlowableAssignmentCtrl', [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/assignment-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    _internalCreateModal(opts, $modal, $scope);
}]);
// 根据需求增加service动态获取内容
angular.module('flowableModeler').controller('FlowableAssignmentPopupCtrl',
    [ '$rootScope', '$scope', '$translate', '$http', 'UserService', 'GroupService', 'assignService','ruleService', function($rootScope, $scope, $translate, $http, UserService, GroupService, assignService, ruleService) {
    // Put json representing assignment on scope
    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.assignment !== undefined
        && $scope.property.value.assignment !== null) {

        $scope.assignment = $scope.property.value.assignment;
        if (typeof $scope.assignment.type === 'undefined') {
            $scope.assignment.type = 'static';
        }

    } else {
        $scope.assignment = {type:'idm'};
    }

    $scope.popup = {
        assignmentObject: {
            type:$scope.assignment.type,
            idm: {
                type:undefined,
                assignee: undefined,
                candidateUsers: [],
                candidateGroups: []
            },
            static: {
                assignee: undefined,
                candidateUsers: [],
                candidateGroups: []
            }
        }
    };

    // 动态获取option与默认合并
    $scope.assignmentOptions = [
        {id: "initiator", name: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.INITIATOR')},
        {id: "user", name: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USER')},
        // {id: "users", name: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.USERS')},
        // {id: "groups", title: $translate.instant('PROPERTY.ASSIGNMENT.IDM.DROPDOWN.GROUPS')}
    ];
    $scope.ruleOption = [
        // {id: "rule1", name: "规则1", type: "role"},
        // {id: "rule2", name: "规则2", type: "fff"}
    ]
    //获取option接口 需接口返回后执行下面逻辑

        assignService.getFilterAssign().then(function(result) {
            return new Promise((resolve, reject) => {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].type === 'USER') {
                        result[i].id = 'users'
                    } else {
                        // result[i].id = result[i].type
                        result[i].id = 'groups'
                    }
                }
                $scope.assignmentOptions = $scope.assignmentOptions.concat(result)
                return resolve();
            })
        }).then(() => {
            return new Promise((resolve) => {
                ruleService.getRules().then(function(res) {
                    for (var i = 0; i < res.length; i++) {
                        res[i].service = res[i].id;
                        res[i].id = 'rules';
                    }
                    $scope.assignmentOptions = $scope.assignmentOptions.concat(res)
                    return resolve();
                })
            })
        }).then(() => {
            return $scope.computedOption();
        }).then(()=>{
            $scope.updateAssign();
        });
        $scope.computedOption = () => {
            return new Promise((resolve) => {
                if ($scope.assignment.idm && $scope.assignment.idm.type) {
                    const reg = /(?<={).*?(?=.perform)/g;
                    if ($scope.assignment.idm.type ==='groups') {
                        const id = $scope.assignment.idm.candidateGroups[0].id
                        if (id.match(reg)) {
                            const service = id.match(reg)[0]
                            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                                if ($scope.assignmentOptions[i].service == service) {
                                    $scope.assignmentOption = $scope.assignmentOptions[i];
                                    GroupService.getFilteredGroups($scope.assignmentOption.type).then((res) => {
                                        // 规则下选项
                                        $scope.ruleChilds = res;
                                        resolve();
                                    })
                                }
                            }
                        } else {
                            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                                let type = $scope.assignment.idm.candidateGroups[0].id.split('_')
                                type = type[type.length - 1]
                                if ($scope.assignmentOptions[i].type == type) {
                                    $scope.assignmentOption = $scope.assignmentOptions[i];
                                    break;
                                }
                            }
                            resolve();
                        }
                    } else if ($scope.assignment.idm.type ==='users') {
                        const id = $scope.assignment.idm.candidateUsers[0].id
                        if (id.match(reg)) {
                            const service = id.match(reg)[0]
                            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                                if ($scope.assignmentOptions[i].service == service) {
                                    $scope.assignmentOption = $scope.assignmentOptions[i];
                                    GroupService.getFilteredGroups($scope.assignmentOption.type).then((res) => {
                                        // 规则下选项
                                        $scope.ruleChilds = res;
                                        resolve();
                                    })
                                }
                            }
                        } else {
                            for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                                if ($scope.assignmentOptions[i].id == $scope.assignment.idm.type) {
                                    $scope.assignmentOption = $scope.assignmentOptions[i];
                                    break;
                                }
                            }
                            resolve();
                        }
                    } else {
                        for (var i = 0; i < $scope.assignmentOptions.length; i++) {
                            if ($scope.assignmentOptions[i].id == $scope.assignment.idm.type) {
                                $scope.assignmentOption = $scope.assignmentOptions[i];
                                break;
                            }
                        }
                        resolve();
                    }
                } else {
                    resolve();
                }
            })
        }
        $scope.updateAssign = function() {
            // fill the IDM area
            if (!$scope.assignmentOption) {
                // Default, first time opening the popup
                $scope.assignmentOption = $scope.assignmentOptions[0];
            } else {
                // Values already filled
                if ($scope.assignment.idm) { //fill the IDM tab
                    const augReg = /(?<=execution,).*?(?=\))/g;
                    if ($scope.assignment.idm.assignee) {
                        if ($scope.assignment.idm.assignee.id) {
                            $scope.popup.assignmentObject.idm.assignee = $scope.assignment.idm.assignee;
                        } else {
                            $scope.popup.assignmentObject.idm.assignee = {email: $scope.assignment.idm.assignee.email};
                        }
                    }
                    if ($scope.assignment.idm.candidateUsers && $scope.assignment.idm.candidateUsers.length > 0) {
                        if ($scope.assignment.idm.candidateUsers[0].id.match(augReg)) {
                            let users = $scope.assignment.idm.candidateUsers[0].id.match(augReg)
                            users = users[0].split(',');
                            for ( let j = 0; j < users.length; j++) {
                                //去掉引号
                                users[j] = users[j].replace(/'/g, '');
                                let ruleArg;
                                for (let k = 0; k < $scope.ruleChilds.length; k++) {
                                    if ($scope.ruleChilds[k].id == users[j]) {
                                        ruleArg = $scope.ruleChilds[k]
                                    }
                                }
                                $scope.popup.assignmentObject.idm.candidateUsers.push(ruleArg);
                            }
                        } else {
                            for (var i = 0; i < $scope.assignment.idm.candidateUsers.length; i++) {
                                $scope.popup.assignmentObject.idm.candidateUsers.push($scope.assignment.idm.candidateUsers[i]);
                            }
                        }
                    }
                    if ($scope.assignment.idm.candidateGroups && $scope.assignment.idm.candidateGroups.length > 0) {
                        if($scope.assignment.idm.candidateGroups[0].id.match(augReg)) {
                            let groups = $scope.assignment.idm.candidateGroups[0].id.match(augReg)
                            groups = groups[0].split(',');
                            for ( let j = 0; j < groups.length; j++) {
                                //去掉引号
                                groups[j] = groups[j].replace(/'/g, '');
                                let ruleArg;
                                for (let k = 0; k < $scope.ruleChilds.length; k++) {
                                    if ($scope.ruleChilds[k].id == groups[j]) {
                                        ruleArg = $scope.ruleChilds[k]
                                    }
                                }
                                $scope.popup.assignmentObject.idm.candidateGroups.push(ruleArg);
                            }
                        } else {
                            for (var i = 0; i < $scope.assignment.idm.candidateGroups.length; i++) {
                                $scope.popup.assignmentObject.idm.candidateGroups.push($scope.assignment.idm.candidateGroups[i]);
                            }
                        }
                    }
                }
            }
            
            //fill the static area
            if ($scope.assignment.assignee) {
                $scope.popup.assignmentObject.static.assignee = $scope.assignment.assignee;
            }
        
            if ($scope.assignment.candidateUsers && $scope.assignment.candidateUsers.length > 0) {
                for (var i = 0; i < $scope.assignment.candidateUsers.length; i++) {
                    $scope.popup.assignmentObject.static.candidateUsers.push($scope.assignment.candidateUsers[i]);
                }
            }
        
            if ($scope.assignment.candidateGroups && $scope.assignment.candidateGroups.length > 0) {
                for (var i = 0; i < $scope.assignment.candidateGroups.length; i++) {
                    $scope.popup.assignmentObject.static.candidateGroups.push($scope.assignment.candidateGroups[i]);
                }
            }
            initStaticContextForEditing($scope);
            $scope.$watch('popup.groupFilter', function () {
                $scope.updateGroupFilter();
            });
            $scope.$watch('popup.filter', function() {
                $scope.updateFilter();
            });
            //监听候选人数据
            $scope.$watch('popup.usersFilter', function() {
                $scope.updateUsersFilter();
            });
            //监听选择变化
            $scope.$watch('assignmentOption', function(n, o) {
                if (n.type != o.type) {
                    $scope.popup.assignmentObject.idm.candidateGroups = [];
                    $scope.popup.groupFilter = '';
                    $scope.popup.groupResults = [];
                    $scope.popup.assignmentObject.idm.candidateUsers = [];
                    $scope.popup.usersFilter = '';
                    $scope.popup.userResults = [];
                }
                if (n.id === 'initiator') {
                    $scope.popup.assignmentObject.idm.assignee = {};
                }
            });
            //监听规则变化
            $scope.$watch('popup.ruleFilter', function() {
                const ruleObj = $scope.assignmentOption;
                if($scope.popup.ruleFilter && ruleObj.type) {
                    GroupService.getFilteredGroups(ruleObj.type, $scope.popup.ruleFilter).then(function(result) {
                        if (ruleObj.returnType === 'GROUP') {
                            $scope.popup.groupResults = result;
                        } else if (ruleObj.returnType === 'USER') {
                            $scope.popup.usersResults = result;
                        }
                        // $scope.resetGroupSelection();
                    });
                }
            });
            $scope.updateFilter = function() {
                if ($scope.popup.oldFilter == undefined || $scope.popup.oldFilter != $scope.popup.filter) {
                    if (!$scope.popup.filter) {
                        $scope.popup.oldFilter = '';
                    } else {
                        $scope.popup.oldFilter = $scope.popup.filter;
                    }
        
                    if ($scope.popup.filter !== null && $scope.popup.filter !== undefined) {
                        UserService.getFilteredUsers($scope.popup.filter).then(function (result) {
                            // var filteredUsers = [];
                            // for (var i=0; i<result.length; i++) {
                            //     var filteredUser = result[i];
        
                            //     var foundCandidateUser = false;
                            //     if ($scope.popup.assignmentObject.idm.candidateUsers !== null && $scope.popup.assignmentObject.idm.candidateUsers !== undefined) {
                            //         for (var j=0; j<$scope.popup.assignmentObject.idm.candidateUsers.length; j++) {
                            //             var candidateUser = $scope.popup.assignmentObject.idm.candidateUsers[j];
                            //             if (candidateUser.id === filteredUser.id) {
                            //                 foundCandidateUser = true;
                            //                 break;
                            //             }
                            //         }
                            //     }
        
                            //     if (!foundCandidateUser) {
                            //         filteredUsers.push(filteredUser);
                            //     }
        
                            // }
        
                            $scope.popup.userResults = result;
                            $scope.resetSelection();
                        });
                    }
                }
            };
            //候选人赋值
            $scope.updateUsersFilter = function() {
                if ($scope.popup.oldUsersFilter == undefined || $scope.popup.oldUsersFilter != $scope.popup.usersFilter) {
                    if (!$scope.popup.usersFilter) {
                        $scope.popup.oldUsersFilter = '';
                    } else {
                        $scope.popup.oldUsersFilter = $scope.popup.usersFilter;
                    }
                    if ($scope.popup.usersFilter !== null && $scope.popup.usersFilter !== undefined) {
                        GroupService.getFilteredGroups($scope.assignmentOption.type, $scope.popup.usersFilter).then(function (result) {
                            $scope.popup.usersResults = result;
                            $scope.resetSelection();
                        });
                    }
                }
            };
            
            $scope.updateGroupFilter = function() {
                if ($scope.popup.oldGroupFilter == undefined || $scope.popup.oldGroupFilter != $scope.popup.groupFilter) {
                    if (!$scope.popup.groupFilter) {
                        $scope.popup.oldGroupFilter = '';
                    } else {
                        $scope.popup.oldGroupFilter = $scope.popup.groupFilter;
                    }
                    //加入非空判断
                    if ($scope.popup.groupFilter !== null && $scope.popup.groupFilter !== undefined) {
                        GroupService.getFilteredGroups($scope.assignmentOption.type, $scope.popup.groupFilter).then(function(result) {
                            $scope.popup.groupResults = result;
                            $scope.resetGroupSelection();
                        });
                    }
                }
            };
        
            $scope.confirmUser = function(user) {
                if (!user) {
                    // Selection is done with keyboard, use selection index
                    var users = $scope.popup.userResults;
                    if ($scope.popup.selectedIndex >= 0 && $scope.popup.selectedIndex < users.length) {
                        user = users[$scope.popup.selectedIndex];
                    }
                }
        
                if (user) {
                    if ("user" == $scope.assignmentOption.id) {
                        $scope.popup.assignmentObject.idm.assignee = user;
                    } else if ("users" == $scope.assignmentOption.id || "rules" == $scope.assignmentOption.id) {
        
                        // Only add if not yet part of candidate users
                        var found = false;
                        if ($scope.popup.assignmentObject.idm.candidateUsers) {
                            for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {
                                if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                    found = true;
                                    break;
                                }
                            }
                        }
        
                        if (!found) {
                            $scope.addCandidateUser(user);
                        }
                    }
                }
            };
        
            $scope.confirmEmail = function() {
                if ("user" == $scope.assignmentOption.id) {
                    $scope.popup.assignmentObject.idm.assignee = {email: $scope.popup.email};
                } else if ("users" == $scope.assignmentOption.id) {
        
                    // Only add if not yet part of candidate users
                    var found = false;
                    if ($scope.popup.assignmentObject.idm.candidateUsers) {
                        for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateUsers.length; i++) {
        
                            if ($scope.popup.assignmentObject.idm.candidateUsers[i].id) {
                                if ($scope.popup.assignmentObject.idm.candidateUsers[i].id === user.id) {
                                    found = true;
                                    break;
                                }
                            } else if ($scope.popup.assignmentObject.idm.candidateUsers[i].email) {
                                if ($scope.popup.assignmentObject.idm.candidateUsers[i].email === $scope.popup.email) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
        
                    if (!found) {
                        $scope.addCandidateUser({email: $scope.popup.email});
                    }
                }
            };
        
            $scope.confirmGroup = function(group) {
                if (!group) {
                    // Selection is done with keyboard, use selection index
                    var groups = $scope.popup.groupResults;
                    if ($scope.popup.selectedGroupIndex >= 0 && $scope.popup.selectedGroupIndex < groups.length) {
                        group = groups[$scope.popup.selectedGroupIndex];
                    }
                }
        
                if (group) {
                    // Only add if not yet part of candidate groups
                    var found = false;
                    if ($scope.popup.assignmentObject.idm.candidateGroups) {
                        for (var i = 0; i < $scope.popup.assignmentObject.idm.candidateGroups.length; i++) {
                            if ($scope.popup.assignmentObject.idm.candidateGroups[i].id === group.id) {
                                found = true;
                                break;
                            }
                        }
                    }
        
                    if (!found) {
                        $scope.addCandidateGroup(group);
                    }
                }
            };
            // $scope.assignmentOptionClick = function(assignmentOption) {
            //     if (assignmentOption.id != $scope.assignmentOption.id) {
            //         console.log(1)
            //     }
            //     console.log('assignmentOption', assignmentOption)
            //     console.log('$scope.assignmentOption', $scope.assignmentOption)
            // }
            $scope.addCandidateUser = function(user) {
                $scope.popup.assignmentObject.idm.candidateUsers.push(user);
            };
            
            $scope.removeCandidateUser = function(user) {
                var users = $scope.popup.assignmentObject.idm.candidateUsers;
                var indexToRemove = -1;
                for (var i = 0; i < users.length; i++) {
                    if (user.id) {
                        if (user.id === users[i].id) {
                            indexToRemove = i;
                            break;
                        }
                    } else {
                        if (user.email === users[i].email) {
                            indexToRemove = i;
                            break;
                        }
                    }
                }
                if (indexToRemove >= 0) {
                    users.splice(indexToRemove, 1);
                }
            };
            
            $scope.addCandidateGroup = function(group) {
                $scope.popup.assignmentObject.idm.candidateGroups.push(group);
            };
            
            $scope.removeCandidateGroup = function(group) {
                var groups = $scope.popup.assignmentObject.idm.candidateGroups;
                var indexToRemove = -1;
                for (var i = 0; i < groups.length; i++) {
                    if (group.id == groups[i].id) {
                        indexToRemove = i;
                        break;
                    }
                }
                if (indexToRemove >= 0) {
                    groups.splice(indexToRemove, 1);
                }
            };
        
            $scope.resetSelection = function() {
                if ($scope.popup.userResults && $scope.popup.userResults.length > 0) {
                    $scope.popup.selectedIndex = 0;
                } else {
                    $scope.popup.selectedIndex = -1;
                }
            };
        
            $scope.nextUser = function() {
                var users = $scope.popup.userResults;
                if (users && users.length > 0 && $scope.popup.selectedIndex < users.length -1) {
                    $scope.popup.selectedIndex += 1;
                }
            };
        
            $scope.previousUser = function() {
                var users = $scope.popup.userResults;
                if (users && users.length > 0 && $scope.popup.selectedIndex > 0) {
                    $scope.popup.selectedIndex -= 1;
                }
            };
        
            $scope.resetGroupSelection = function() {
                if ($scope.popup.groupResults && $scope.popup.groupResults.length > 0) {
                    $scope.popup.selectedGroupIndex = 0;
                } else {
                    $scope.popup.selectedGroupIndex = -1;
                }
            };
        
            $scope.nextGroup = function() {
                var groups = $scope.popup.groupResults;
                if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex < groups.length -1) {
                    $scope.popup.selectedGroupIndex += 1;
                }
            };
        
            $scope.previousGroup = function() {
                var groups = $scope.popup.groupResults;
                if (groups && groups.length > 0 && $scope.popup.selectedGroupIndex > 0) {
                    $scope.popup.selectedGroupIndex -= 1;
                }
            };
        
            $scope.removeAssignee = function() {
                $scope.popup.assignmentObject.idm.assignee = undefined;
            };
            
            // Click handler for + button after enum value
            $scope.addCandidateUserValue = function(index) {
                $scope.popup.assignmentObject.static.candidateUsers.splice(index + 1, 0, {value: ''});
            };
        
            // Click handler for - button after enum value
            $scope.removeCandidateUserValue = function(index) {
                $scope.popup.assignmentObject.static.candidateUsers.splice(index, 1);
            };
        
            // Click handler for + button after enum value
            $scope.addCandidateGroupValue = function(index) {
                $scope.popup.assignmentObject.static.candidateGroups.splice(index + 1, 0, {value: ''});
            };
        
            // Click handler for - button after enum value
            $scope.removeCandidateGroupValue = function(index) {
                $scope.popup.assignmentObject.static.candidateGroups.splice(index, 1);
            };
            
            $scope.setSearchType = function() {
                $scope.popup.assignmentObject.assignmentSourceType = 'search';
            };
        
            $scope.allSteps = EDITOR.UTIL.collectSortedElementsFromPrecedingElements($scope.selectedShape);
        
            $scope.save = function () {
        
                handleAssignmentInput($scope.popup.assignmentObject.static);
        
                $scope.assignment.type = $scope.popup.assignmentObject.type;
        
                if ('idm' === $scope.popup.assignmentObject.type) { // IDM
                    if (JSON.stringify($scope.popup.assignmentObject.idm.assignee) != undefined || $scope.popup.assignmentObject.idm.candidateGroups.length > 0 || $scope.popup.assignmentObject.idm.candidateUsers.length > 0 || $scope.assignmentOption.id == 'rules') {
                        $scope.popup.assignmentObject.static = undefined;

                        //Construct an IDM object to be saved to the process model.
                        var idm = { type: $scope.assignmentOption.id };
                        if ('user' == idm.type) {
                            if ($scope.popup.assignmentObject.idm.assignee) {
                                idm.assignee = $scope.popup.assignmentObject.idm.assignee;
                            }
                        } else if ('users' == idm.type) {
                            if ($scope.popup.assignmentObject.idm.candidateUsers && $scope.popup.assignmentObject.idm.candidateUsers.length > 0) {
                                idm.candidateUsers = $scope.popup.assignmentObject.idm.candidateUsers;
                            }
                        } else if ('rules' == idm.type) {
                            if ($scope.assignmentOption.returnType === 'GROUP') {
                                if ($scope.assignmentOption.needParam) {
                                    let ids = $scope.popup.assignmentObject.idm.candidateGroups.map((item) => {
                                        return `'${item.id}'`;
                                    })
                                    idm.candidateGroups = [{
                                        id: '${'+ $scope.assignmentOption.service +'.perform(execution,'+ ids.join(',') +')}',
                                        typeName: $scope.assignmentOption.name
                                    }]
                                } else {
                                    idm.candidateGroups = [{
                                        id: '${'+ $scope.assignmentOption.service +'.perform(execution)}',
                                        typeName: $scope.assignmentOption.name
                                    }]
                                }
                                idm.type = 'groups'
                            } else if ($scope.assignmentOption.returnType === 'USER') {
                                if ($scope.assignmentOption.needParam) {
                                    let ids = $scope.popup.assignmentObject.idm.candidateUsers.map((item) => {
                                        return `'${item.id}'`;
                                    })
                                    idm.candidateUsers = [{
                                        id: '${'+ $scope.assignmentOption.service +'.perform(execution,'+ ids.join(',') +')}',
                                        typeName: $scope.assignmentOption.name
                                    }]
                                } else {
                                    idm.candidateUsers = [{
                                        id: '${'+ $scope.assignmentOption.service +'.perform(execution)}',
                                        typeName: $scope.assignmentOption.name
                                    }]
                                }
                                idm.type = 'users'
                            }
                        } else {
                            //其他添加类型服用候选人组
                            if ($scope.popup.assignmentObject.idm.candidateGroups && $scope.popup.assignmentObject.idm.candidateGroups.length > 0) {
                                idm.candidateGroups = $scope.popup.assignmentObject.idm.candidateGroups;
                            }
                        }
                        $scope.assignment.idm = idm;
                        $scope.assignment.assignee = undefined;
                        $scope.assignment.candidateUsers = undefined;
                        $scope.assignment.candidateGroups = undefined;
                    } else {
                        $scope.assignment.idm = undefined;
                        $scope.assignment.assignee = undefined;
                        $scope.assignment.candidateUsers = undefined;
                        $scope.assignment.candidateGroups = undefined;
                    }
                }
        
                if ('static' === $scope.popup.assignmentObject.type) { // IDM
                    $scope.popup.assignmentObject.idm = undefined;
                    $scope.assignment.idm = undefined;
                    $scope.assignment.assignee = $scope.popup.assignmentObject.static.assignee;
                    $scope.assignment.candidateUsers = $scope.popup.assignmentObject.static.candidateUsers;
                    $scope.assignment.candidateGroups = $scope.popup.assignmentObject.static.candidateGroups;
                }
        
                $scope.property.value = {};
                $scope.property.value.assignment = $scope.assignment;
                $scope.updatePropertyInModel($scope.property);
                $scope.close();
            };
        
            // Close button handler
            $scope.close = function() {
                $scope.property.mode = 'read';
                $scope.$hide();
            };
        
            var handleAssignmentInput = function ($assignment) {
            
                function isEmptyString(value) {
                  return (value === undefined || value === null || value.trim().length === 0);
                }
            
                if (isEmptyString($assignment.assignee)){
                  $assignment.assignee = undefined;
                }
                var toRemoveIndexes;
                var removedItems=0;
                var i = 0;
                if ($assignment.candidateUsers) {
                  toRemoveIndexes = [];
                  for (i = 0; i < $assignment.candidateUsers.length; i++) {
                    if (isEmptyString($assignment.candidateUsers[i].value)) {
                      toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                  }
            
                  if (toRemoveIndexes.length == $assignment.candidateUsers.length) {
                    $assignment.candidateUsers = undefined;
                  } else {
                     removedItems=0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                      $assignment.candidateUsers.splice(toRemoveIndexes[i]-removedItems, 1);
                      removedItems++;
                    }
                  }
                }
            
                if ($assignment.candidateGroups) {
                  toRemoveIndexes = [];
                  for (i = 0; i < $assignment.candidateGroups.length; i++) {
                    if (isEmptyString($assignment.candidateGroups[i].value)) {
                      toRemoveIndexes[toRemoveIndexes.length] = i;
                    }
                  }
            
                  if (toRemoveIndexes.length == $assignment.candidateGroups.length) {
                    $assignment.candidateGroups = undefined;
                  } else {
                     removedItems=0;
                    for (i = 0; i < toRemoveIndexes.length; i++) {
                      $assignment.candidateGroups.splice(toRemoveIndexes[i]-removedItems, 1);
                      removedItems++;
                    }
                  }
                }
            };
            
            function initStaticContextForEditing($scope) {
                if (!$scope.popup.assignmentObject.static.candidateUsers || $scope.popup.assignmentObject.static.candidateUsers.length==0) {
                  $scope.popup.assignmentObject.static.candidateUsers = [{value: ''}];
                }
                if (!$scope.popup.assignmentObject.static.candidateGroups || $scope.popup.assignmentObject.static.candidateGroups.length==0) {
                  $scope.popup.assignmentObject.static.candidateGroups = [{value: ''}];
                }
            }
            
    };
}]);
