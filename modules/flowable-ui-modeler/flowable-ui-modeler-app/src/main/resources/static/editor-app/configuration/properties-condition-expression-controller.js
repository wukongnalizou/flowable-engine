
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
 * Condition expression
 */

angular
  .module("flowableModeler")
  .controller("FlowableConditionExpressionCtrl", [
    "$scope",
    "$modal",
    "editorManager",
    "$translate",
    "$q",
    "$http",
    function ($scope, $modal, editorManager, $translate, $q, $http) {
      // Config for the modal window
      var opts = {
        template:
          "editor-app/configuration/properties/condition-expression-popup.html?version=" +
          Date.now(),
        scope: $scope
      };
    var json = editorManager.getModel();
    let formKey = json.childShapes[0].properties.formkeydefinition
    let formReference = json.childShapes[0].properties.formreference
    let condition = '';
      if (formKey) {
      condition = formKey.key;
    } else {
        condition = formReference.key;
    }
    const prefix_request = window.localStorage.getItem('pea_workflow_dynamic_request_prefix');
    // 通过获取表单关键字查询自定义表单里的属性
    let url = `${prefix_request}/msc/PEP_FORM_TEMPLATE?query=${encodeURIComponent(JSON.stringify({ formkeydefinition: 'basicForm' }))}`;
    let basicProperties = [];
    $scope.formProperties = []
    // let textArray = ['Select', 'RadioGroup', 'CheckboxGroup', 'OopSystemCurrent', 'DatePicker']
    $http.get(url, {}).success(function (resp, status, headers, config) {
      let url1 = `${prefix_request}/msc/PEP_FORM_TEMPLATE?query=${encodeURIComponent(JSON.stringify({ formkeydefinition: condition }))}`;
      $http.get(url1, {}).success(function (resp1, status1, headers1, config1) {
        var result1 = resp1.data[0];
        let formProperties = [];
        let textArray = ['Select', 'RadioGroup', 'CheckboxGroup', 'OopSystemCurrent', 'DatePicker']
        if (result1 && result1.formDetails) {
          var formJson1 = JSON.parse(result1.formDetails).formJson;
          formProperties = formJson1.map(item => ({
            name: item.label,
            id: item.name,
            readable: true,
            writable: true,
            type: null,
            isCustomForm: true,
            componentKey: item.component.name || '',
            textValue: textArray.indexOf(item.component.name) > -1 ? true : false,
            children: item.component.children && item.component.children.length > 0 ? item.component.children : []
          }));
          $scope.formProperties = formProperties  
        }
        let result = resp.data[0];
        if (result && result.formDetails) {
          var formJson = JSON.parse(result.formDetails).formJson;
          basicProperties = formJson.map(item => ({
            name: item.label,
            id: item.name,
            readable: true,
            writable: true,
            type: null,
            isCustomForm: true,
            componentKey: item.component.name || '',
            textValue: textArray.indexOf(item.component.name) > -1 ? true : false,
            children: item.component.children && item.component.children.length > 0 ? item.component.children : []
          }));
        }
        $scope.formProperties = [...$scope.formProperties, ...basicProperties]
        $scope.enumValues = [];

        $scope.translationsRetrieved = false;

        $scope.labels = {};
        var idPromise = $translate("PROPERTY.FORMPROPERTIES.ID");
        var namePromise = $translate("PROPERTY.FORMPROPERTIES.NAME");
        var typePromise = $translate("PROPERTY.FORMPROPERTIES.TYPE");
        $q.all([idPromise, namePromise, typePromise]).then(function (results) {
          $scope.labels.idLabel = results[0];
          $scope.labels.nameLabel = results[1];
          $scope.labels.typeLabel = results[2];
          $scope.translationsRetrieved = true;

          // Config for grid
          $scope.gridOptions = {
            data: $scope.formProperties,
            headerRowHeight: 28,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableHorizontalScrollbar: 0,
            enableColumnMenus: false,
            enableSorting: false,
            columnDefs: [{ field: 'id', displayName: $scope.labels.idLabel },
            { field: 'name', displayName: $scope.labels.nameLabel },
            { field: 'type', displayName: $scope.labels.typeLabel }]
          };

          $scope.enumGridOptions = {
            data: $scope.enumValues,
            headerRowHeight: 28,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableHorizontalScrollbar: 0,
            enableColumnMenus: false,
            enableSorting: false,
            columnDefs: [{ field: 'id', displayName: $scope.labels.idLabel },
            { field: 'name', displayName: $scope.labels.nameLabel }]
          }

          $scope.gridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              $scope.selectedProperty = row.entity;
              $scope.selectedEnumValue = undefined;
              if ($scope.selectedProperty && $scope.selectedProperty.enumValues) {
                $scope.enumValues.length = 0;
                for (var i = 0; i < $scope.selectedProperty.enumValues.length; i++) {
                  $scope.enumValues.push($scope.selectedProperty.enumValues[i]);
                }
              }
            });
          };

          $scope.enumGridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.enumGridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
              $scope.selectedEnumValue = row.entity;
            });
          };
        });
      }).error(function (data1, status1, headers1, config1) {
        alert(resp1);
      })
      
      // $scope.formProperties = json.childShapes[0].properties.formproperties.formProperties;
      // Open the dialog
      _internalCreateModal(opts, $modal, $scope);
    }).error(function (data, status, headers, config) {
      alert(data);
    })
    
    }
  ]);

angular
  .module("flowableModeler")
  .controller("FlowableConditionExpressionPopupCtrl", [
    "$rootScope",
    "$scope",
    "$translate",
    "editorManager",
    "$http",
    function ($rootScope, $scope, $translate, editorManager, $http) {
      // Put json representing assignment on scope
      let natureValue = '';
      if (
        $scope.property.value !== undefined &&
        $scope.property.value !== null &&
        $scope.property.value.expression !== undefined &&
        $scope.property.value.expression !== null
      ) {
        $scope.expression = $scope.property.value.expression;
        if ($scope.property.value.expression.natureValue) {
          natureValue = $scope.property.value.expression.natureValue
        }
        $scope.expression = {
          type: $scope.property.value.expression.type,
          staticValue: $scope.property.value.expression.staticValue,
          natureValue: natureValue
        }
      } else if (
        $scope.property.value !== undefined &&
        $scope.property.value !== null &&
        $scope.property.value !== ''
      ) {
        let params = {
          sequenceCondition: $scope.property.value,
          params: $scope.formProperties,
          parserEnum: 'TONATUAL', // TOFLOWABLE 转为flowable TONATUAL转为自然语言
        };
        $http({
          method: 'POST',
          data: params,
          ignoreErrors: true,
          headers: {
            'Accept': 'application/json',
          },
          url: FLOWABLE.APP_URL.checkCondition()
        }).success(function (data, status, headers, config) {
          $scope.expression = {
            type: "static",
            staticValue: $scope.property.value,
            natureValue: data.sequenceCondition
          }
        }).error(function (data, status, headers, config) {
          alert(data)
        });
      } else {
        $scope.expression = {};
      }
      $scope.info = false;
      $scope.operations = [
        {
          title: '>',
          des: '大于',
          exa: '${请假天数} > 3'
        },
        {
          title: '>=',
          des: '大于等于',
          exa: '${请假天数} >= 3'
        },
        {
          title: '==',
          des: '等于',
          exa: '${部门} == "研发部"'
        },
        {
          title: '<=',
          des: '小于等于',
          exa: '${报销金额} <= 100'
        },
        {
          title: '<',
          des: '小于',
          exa: '${报销金额} < 100'
        },
        {
          title: '!=',
          des: '不等于',
          exa: '${部门} != "研发部"'
        },
        {
          title: '+',
          des: '加',
          exa: '(${事假天数} + ${调休天数}) > 3'
        },
        {
          title: '-',
          des: '减',
          exa: '(${加班天数} - ${调休天数}) > 1'
        },
        {
          title: '*',
          des: '乘',
          exa: '(${单价} * ${数量}) > 100'
        },
        {
          title: '/',
          des: '除',
          exa: '(${金额} / ${数量}) < 10'
        },
        {
          title: '&&',
          des: '并且',
          exa: '${部门} == "研发部" && ${请假天数} > 3'
        },
        {
          title: '||',
          des: '或者',
          exa: '${部门} == "研发部" || ${请假天数} > 3'
        },
        {
          title: '!',
          des: '取反',
          exa: '!(${部门} == "研发部")'
        },
        {
          title: '( )',
          des: '括号',
          exa: '(${事假天数} + ${调休天数}) > 3'
        },
      ];
      $scope.selectdItem = '';
      $scope.check = function (gridOptions) {
        // var params = {
        //   sequenceCondition: "111",
        //   params: [{ "id": "organizationName", "name": "部门" }, { "id": "vacationTime", "name": "请假时长" }, { "id": "vacationType", "name": "请假类型" }],
        //   parserEnum: 'TOFLOWABLE',
        // };
        var params = {
          sequenceCondition: $scope.expression.natureValue,
          params: gridOptions.data,
          parserEnum: 'TOFLOWABLE', // TOFLOWABLE 转为flowable TONATUAL转为自然语言
        };
        $http({
          method: 'POST',
          data: params,
          ignoreErrors: true,
          headers: {
            'Accept': 'application/json',
          },
          url: FLOWABLE.APP_URL.checkCondition()
        }).success(function (data, status, headers, config) {
          $scope.expression.staticValue = data.sequenceCondition
            alert('检查符合规范')
        }).error(function (data, status, headers, config) {
          alert(data)
        });
      };
      $scope.save = function (gridOptions) {
        if ($scope.expression.natureValue !== '') {
          var params = {
            sequenceCondition: $scope.expression.natureValue,
            params: gridOptions.data,
            parserEnum: 'TOFLOWABLE', // false 转为flowable true转为自然语言
          };
          $http({
            method: 'POST',
            data: params,
            ignoreErrors: true,
            headers: {
              'Accept': 'application/json',
            },
            url: FLOWABLE.APP_URL.checkCondition()
          }).success(function (data, status, headers, config) {
            $scope.expression.staticValue = data.sequenceCondition
            $scope.expression.type = 'static'
            $scope.property.value = { expression: $scope.expression };
            $scope.updatePropertyInModel($scope.property);
            $scope.close();
          }).error(function (data, status, headers, config) {
            alert(data)
          });
        } else {
          $scope.property.value = '';
          $scope.updatePropertyInModel($scope.property);
          $scope.close();
        }
        
      };
      $scope.hover = function(item) {
        $scope.selectdItem = item.title
      };
      $scope.leave = function() {
        $scope.selectdItem = ''
      }
      $scope.clear = function() {
        $scope.expression = {}
      };
      // Close button handler
      $scope.close = function() {
        $scope.property.mode = "read";
        $scope.$hide();
      };
      $scope.showMore = function() {
        $scope.info = true;
      };
      $scope.closeInfo = function() {
        $scope.info = false;
      }
    }
  ]);