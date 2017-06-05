import dragula from 'dragula';
import 'css/dragula.css';
import _ from 'underscore';
import Vue from 'vue';
import itemBox from 'vueModel/itemBox.vue';
import ztree from 'ztree';

import Modal from './modal';
//import kjdpAjax from 'util/ajax';
export default class Dashboard {

  constructor(leftId, rightId) {
        // _.extend(this,{leftId:leftId,rightId:rightId});
  }

  initPage(tabDomId,rawTabId,groupId) {
    let me = this;
    return new Vue({
      el: `#${tabDomId}`,
      components: {
        itemsBox: itemBox
      },
      ready() {
        const that = this;

        that.getBoxData();

        dragula([$(`#${tabDomId}left-events`)[0], $(`#${tabDomId}right-events`)[0]], {
          moves(el, container, handle) {
            return handle.classList.contains('hmain_listbt') || handle.classList.contains('itemBoxTitle');
          }

        }).on('drop', (el, container) => {
               // reorder the left blank block, it should be always on the bottom
          const lastOne = $(`#${tabDomId}left-events`).find('.hmain_list:last');
          const addBlock = $(`#${tabDomId}left-events`).find('.hmain_list_add');

          if (lastOne.length === 0) {
            addBlock.show();
          } else {
            $(`#${tabDomId}left-events`).find('.hmain_list:last').after(addBlock.show());
          }

          that.positionSave();
        }).on('drag', (el, container) => {
               // addBlock toggle show and hide
          const leftBlock = $(`#${tabDomId}left-events`).find('.hmain_list');
          const addBlock = $(`#${tabDomId}left-events`).find('.hmain_list_add');

          if (leftBlock.length === 1) {
            if (!leftBlock.is(el)) {
              addBlock.hide();
            } else {
              addBlock.show();
            }
          } else if (leftBlock.length === 0) {
            addBlock.show();
          } else {
            addBlock.hide();
          }
        }).on('cancel', (el, container) => {
          const addBlock = $(`#${tabDomId}left-events`).find('.hmain_list_add');
          addBlock.show();
        });
      },
      data() {
            // initialization
        return {
          pleftLinks: [],
          prightLinks: [],
          ptabId: tabDomId,
          rawTabId:rawTabId,
          groupId:groupId
        };
      },
      methods: {
        positionSave() {
          const leftWidget = $(`#${tabDomId}left-events`).find('.hmain_list');
          const rightWidget = $(`#${tabDomId}right-events`).find('.hmain_list');

          const newWidgets = [];

          const iteratorFn = (position) => {
            return (index, item) => {
              //把menuId改成boxId,groupId改成tabId----"groupId-1-tabs-1"
              newWidgets.push({
                boxId: $(item).attr('boxId'),
                tabId: $(item).attr('tabId'),
                orderNum: index,
                position
              });
            };
          };
          $.each(leftWidget, iteratorFn('L'));
          $.each(rightWidget, iteratorFn('R'));
          console.log(newWidgets);
                // here is the way to save the newWidgets position
        },
        getBoxData(newBoxId) {
          let that = this;
          let currentGroupId = that.$get('groupId');
          let addHeightLine=false;
          //模拟AJAX
          //that.$get('rawTabId');当有多个tabId时
          //that.$get('rawTabId');当有多个tabId时需要对比刷新哪一个



          const leftData = [];
          const rightData = [];

          let linkCont = [
            {"LINK_ID":"01","LINK_NAME":"linkname1","LINK_URL":"http://www.baidu.com"},
            {"LINK_ID":"02","LINK_NAME":"linkname2","LINK_URL":"http://www.baidu.com"},
            {"LINK_ID":"03","LINK_NAME":"linkname3","LINK_URL":"http://www.baidu.com"},
            {"LINK_ID":"04","LINK_NAME":"linkname4","LINK_URL":"http://www.baidu.com"},
            {"LINK_ID":"05","LINK_NAME":"linkname5","LINK_URL":"http://www.baidu.com"}
          ];
          let dataBoxs = [
            {"POSITION":"L","BOX_NAME":"boxname1","BOX_ID":"001"},
            {"POSITION":"R","BOX_NAME":"boxname2","BOX_ID":"002"},
            {"POSITION":"L","BOX_NAME":"boxname3","BOX_ID":"003"},
            {"POSITION":"R","BOX_NAME":"boxname4","BOX_ID":"004"}
          ]

          $.each(dataBoxs, (i, boxItem) => {
         
            if(newBoxId && boxItem.BOX_ID==newBoxId){
                addHeightLine=true;
            }
            if (boxItem.POSITION === 'L') {

              leftData.push({ menuLinks: linkCont, BOX_NAME: boxItem.BOX_NAME, BOX_ID: boxItem.BOX_ID, BOXFLAG: addHeightLine });
            } else {
              rightData.push({ menuLinks: linkCont, BOX_NAME: boxItem.BOX_NAME, BOX_ID: boxItem.BOX_ID, BOXFLAG: addHeightLine  });
            }

            addHeightLine=false;
          });

          that.$set('pleftLinks', leftData);
          that.$set('prightLinks', rightData);

        }

      },
      events: {
        onModalClick() {
          let tabId = this.$get('rawTabId');
          let pTarget = this;


          const modal = Modal.getModalInst({ tabId, pTarget });


          Modal.showModal({success:(boxId) => {
            $('#boxItemWindow').modal('hide');
            console.log(boxId);
            pTarget.getBoxData(boxId);
          },scope:this});
          

        },
        removeItemBox(item, direction,boxId) {
          //bexDeleteOPP_MENU_BOX 不知道是不是级联删除，先注释掉
         if(!confirm("确定要删除吗？")){
            return;
         }
          // kjdpAjax.post({
          //   req: {
          //     service: 'Y3000001',
          //     LBM: 'bexDeleteOPP_MENU_BOX',
          //     BOX_ID: boxId
          //   }
          // }).then((data) => {

          // })
          if (direction == 'left') {
            this.pleftLinks.$remove(this.pleftLinks[item]);
          } else if (direction == 'right') {
            this.prightLinks.$remove(this.prightLinks[item]);
          }
        },
        boxEditor(linksData){
          console.log(linksData);
          let boxId = linksData.BOX_ID;
          let boxName = linksData.BOX_NAME;
          //bexSelectOPP_MENU_LINK
          let tabId = this.$get('rawTabId');
          let pTarget = this;
          let startData={ boxId:boxId,boxName:boxName }
          const modal = Modal.getModalInst({ tabId, pTarget });

          //kjdpAjax.post({
          //  req: {
          //    service: 'Y3000001',
          //    LBM: 'bexSelectOPP_MENU_LINK',
          //    BOX_ID: boxId
          //  }
          //}).then((data) => {
          //  //返回的字段需要多一个BUS_CODE
          //
          //  startData.menuLink=data[0];
          //
          //  Modal.showModal({success:(boxId) => {
          //    $('#boxItemWindow').modal('hide');
          //    console.log(boxId);
          //    pTarget.getBoxData(boxId);
          //  },scope:pTarget,InitData:startData});
          //
          //
          //})

        }
      }
    });
  }
}

