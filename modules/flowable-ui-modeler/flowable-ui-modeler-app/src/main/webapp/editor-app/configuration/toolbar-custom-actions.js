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
/**
 * 为了简化流程设计步骤，合并 activiti 提供的流程设计器中的 “模型”、“部署” 和 “流程定义” 概念
 * 对外统一表述为 “流程”
 * 故需要同步原来的三个概念中的 名称/描述 信息项
 * 此指令用来同步设计器中的 名称/描述 至保存对话框中
 */
var wdUnify = function() {
  return {
    restrict: 'A',
    link: function(scope) {
      // 弹出保存对话框时将设计器中的 名称/描述 同步到对话框中显示
      var properties = scope.editor.properties;
      scope.saveDialog.name = properties.name;
      scope.saveDialog.key = properties.process_id;
      scope.saveDialog.description = properties.documentation;

      // 为避免在保存对话框中修改 名称/描述 后还需要同步回设计器，禁止在保存对话框中修改
      scope.readonly = true;
    }
  };
};

angular.module('flowableModeler').directive('wdUnify', wdUnify);

jQuery.fn.resize = function(callback) {
  var str = callback.toString();
  if (str.indexOf('#paletteSection') === -1) {
    return callback;
  }
}
jQuery(window).on('resize',function(){
  setTimeout(function(){
    var mainHeader = jQuery('#main-header');
    var offset = jQuery("#editor-header").offset();
    var totalAvailable = jQuery(window).height() - offset.top - mainHeader.height() - 21;
    var propSectionHeight = jQuery('#propertySection').height();
    var treeViewHeight = jQuery('#process-treeview-wrapper').height();
    var footerHeight = jQuery('#paletteSectionFooter').height();
    jQuery('#canvasSection').height(totalAvailable - propSectionHeight - 40);
    jQuery('#paletteSection').height(totalAvailable - treeViewHeight - footerHeight - 40);
  },100)
})
