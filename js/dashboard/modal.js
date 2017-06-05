import Vue from 'vue';
import 'css/dragula.css';
import modal from 'vueModel/modal.vue';
import _ from 'underscore';
import Dashboard from './dashboard';
import ztree from 'ztree';

import constans from 'util/constans';
import utils from 'util/utils';

export default class Modal {

  static getModalInst(param) {

    Modal.tabId = param.tabId;

    if (_.isEmpty(Modal.modalInst)) {
      Modal.modalInst = new Vue({
        el: '#modalBox',
        data: { tabId: param.tabId, pTarget: param.pTarget,pmodalstitle:{name:'',id:''} },
        components: {
          modalDialog: modal
        },
        ready() {

        },
        events: {
          popupButtonRight(selectData) {
            let treeObj = $.fn.zTree.getZTreeObj('menuTree');
            let nodes = treeObj.getCheckedNodes(true);
            let newNodes = [];

            if(selectData.length>'0'){
              for (let selectNodes of selectData) {
                 newNodes.push({ link: selectNodes.link, name: selectNodes.name ,linkId:selectNodes.linkId});
              }
            }

            for (let sNodes of nodes) {
              if (!sNodes.isParent) {
                 let flag=true;
                 if(selectData.length>0){
                  $.each(selectData,(index,selectNode)=>{
                     if(sNodes.id==selectNode.linkId) {
                      flag = false;
                      return;
                    };
                  }) 
                 }
               
                 if(flag){
                  newNodes.push({ link: sNodes.link, name: sNodes.name ,linkId:sNodes.id});
                 }              
              }
            }

            this.$set('modals', newNodes);
          },
          setModalMeg(dataModal) {
            if (!dataModal.title.name) {
              alert('请输入模块名称！');
              this.$el.querySelector('.popup_input').focus();
              return;
            }
            if (!dataModal.list || dataModal.list.length == '0') {
              alert('请选择需要添加的菜单！');
              return;
            }

            //新增
            if(!dataModal.title.id){
        
              //设置添加在左边或右边
              let LorR = '';
              if (this.pTarget.$get('prightLinks').length < this.pTarget.$get('pleftLinks').length) {
                LorR = 'R';
              } else {
                LorR = 'L';
              }
              let linkData = [];
              $.each(dataModal.list, (index, item) => {
                linkData.push({ LINK_NAME: item.name, LINK_URL: item.link, CLS_TYPE: '' });
              });

              let setData = { TAB_ID: this.tabId, BOX_NAME: dataModal.title.name, POSITION: LorR, CLS_TYPE: '', LINKS: utils.toJSON(linkData) };

              // homepage_insert_boxAndLinks
              //kjdpAjax.post({
              //  req: $.extend({
              //    service: 'homepage_insert_boxAndLinks'
              //
              //  },setData)
              //}).then((data,head,meg) => {
              //  //data[0][0].id
              //  if(!_.isUndefined(Modal.success)){
              //  Modal.success.call(Modal.scope,data[0][0].ID);
              //}
              //});
              
            }else{
              //修改
              //没有级联修改的API



            }
     
          },
          cancelModal() {

                // this.$destroy();
          },
          onReset() {
            let dataReset = [];
            this.$set('modals', dataReset);
            let treeObj = $.fn.zTree.getZTreeObj('menuTree');
            treeObj.checkAllNodes(false);
          }
        }
      });
      return Modal.modalInst;
    } else {
//CALL AJAX


      Modal.modalInst.$set('tabId', param.tabId);
      return Modal.modalInst;
    }
  }


  static modalInst = {};

  constructor(targId, tabId, pTarget) {
    _.extend(this, { targId, tabId, pTarget });
    this.initModal();
  }

  static showModal(param) {
    Modal.modalInst.$children[0].$set('menuTree',[]);
    Modal.modalInst.$children[0].$set('modalstitle',{name:'',id:''});
    setTimeout(()=>{
      let treeObj = $.fn.zTree.getZTreeObj('menuTree');
      if (!_.isEmpty(treeObj)) {
        //checkAllNodes不会触发事件回调
        treeObj.checkAllNodes(false);
        treeObj.expandAll(false);
      }
      if(param.InitData){
        //初始化标题
        Modal.modalInst.$children[0].$set('modalstitle',{name:param.InitData.boxName,id:param.InitData.boxId});
        //初始化节点树
        $.each(param.InitData.menuLink,(index,linkItem)=>{
          var node = treeObj.getNodeByParam("link", linkItem.LINK_URL, null);
          treeObj.checkNode(node,true, true, true);
        })

      }
    
      $('#boxItemWindow').modal('show');

      _.extend(Modal,param);
    },500);

  }

  initModal(param, data) {

  }

  vueStrap() {
        // :TODO
  }
}

