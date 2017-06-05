import _ from 'underscore';
import Vue from 'vue';
import menu from 'vueModel/mainMenu.vue';
import modal from 'vueModel/modal.vue';
import Dashboard from './dashboard';

export default class MainMenu {

  constructor(tabsFrame, favourMenu) {
    _.extend(this, { tabsFrame, favourMenu });
  }

  initMenu() {
    let me = this;
    new Vue({
      el: '#mainMenu',
      components: {
        mainMenu: menu
      },
      ready() {
        const that = this;
        that.$set('classflag',true); 
                    // 模拟AJAX

        that.getNewMenu(that);

      },
      events: {
        onMenuClick(groupMenu) {


          //setup1: 根据groupId拿到对应的menuTab, 目前只支持一个tab
          const tabDomId = `groupId-${groupMenu.GROUP_ID}-tabs-t1`;
          me.tabsFrame.addTab({
              title: groupMenu.GROUP_NAME,
              html: `<div id="${tabDomId}"><items-box :left-links="pleftLinks", :right-links="prightLinks", :tab-id="ptabId"></items-box></div>`,
              closable: true,
              id:`"${tabDomId}"`
            });
          this.initNewTab(tabDomId, "t1",groupMenu.GROUP_ID);



          // kjdpAjax.post({
          //         req: {
          //           service: 'Y3000001',
          //           LBM:'bexSelectOPP_MENU_TAB',
          //           GROUP_ID:groupMenu.GROUP_ID
          //         }
          // }).then((data) => {

          // //setup2: 根据拿到的menuTab list,初始化每一个tab


          // const tabDomId = `groupId-${groupMenu.GROUP_ID}-tabs-${data[0][0].TAB_ID}`;
          // me.tabsFrame.addTab({
          //     title: groupMenu.GROUP_NAME,
          //     html: `<div id="${tabDomId}"><items-box :left-links="pleftLinks", :right-links="prightLinks", :tab-id="ptabId"></items-box></div>`,
          //     closable: true
          //   });
          //   this.initNewTab(tabDomId, data[0][0].TAB_ID,groupMenu.GROUP_ID);

          // });
          

        },
        setNewMenu(newMenu,scope){

          //添加菜单后，新建的tab不能点击添加弹出模态框
          console.log(scope)
          let that=this;
          if(newMenu==''){
            alert('请输入菜单名称!');
            setTimeout(() => {
                this.$el.querySelector('.addMenuSty').focus();
            },500);
            return;
          }  
          //kjdpAjax.post({
          //  req: {
          //    service: 'Y3000001',
          //    LBM:'bexInsertOPP_GROUP_MENU',
          //    PARENT_ID:'0',
          //    ICON_CLS:'',
          //    GROUP_NAME:newMenu
          //  }
          //}).then((data) => {
          //  if(data){
          //  scope.$set('addflag',true);
          //  that.getNewMenu(that);
          //  }
          //});
        }

      },
      methods: {
        initNewTab(tabDomId, dbTabId,groupId) {
          const dashboard = new Dashboard(tabDomId).initPage(tabDomId, dbTabId,groupId);
          dashboard.$on('onLinkClick', (linkInfo) => {
            // save the favours data
            console.log(me.favourMenu.inst.$data.pfavourlist[0].menuName);
          });
        },

        getNewMenu(scope){

          let data ={
            "leftMenu" : [
              {"GROUP_ID":"g1","GROUP_NAME":"标签页一","ICON_CLS":"icon_01"},
              {"GROUP_ID":"g2","GROUP_NAME":"标签页二","ICON_CLS":"icon_02"},
              {"GROUP_ID":"g3","GROUP_NAME":"标签页三","ICON_CLS":"icon_01"},
              {"GROUP_ID":"g4","GROUP_NAME":"标签页四","ICON_CLS":"icon_02"}
            ]}

          const menusData=[];
              $.each(data.leftMenu,(index,item)=>{
                menusData.push({GROUP_NAME:item.GROUP_NAME,GROUP_ID:item.GROUP_ID,ICON_CLS:item.ICON_CLS});
              })

          scope.$set('pmenus', menusData);

        // kjdpAjax.post({
        //         req: {
        //           service: 'Y3000001',
        //           LBM:'bexSelectOPP_GROUP_MENU',
        //           PARENT_ID:'0'
        //         }
        // }).then((data) => {
        //       const menusData=[];
        //       $.each(data[0],(index,item)=>{
        //         menusData.push({GROUP_NAME:item.GROUP_NAME,GROUP_ID:item.GROUP_ID,ICON_CLS:item.ICON_CLS});
        //       })

        //       scope.$set('pmenus', menusData);
             
        //  });
        }
      },
      data() {
        return {
          pboardId: { GROUP_ID: '', GROUP_NAME: '' }
        };
      },
      init() {
        me.favourMenu.initMenu();
      }
    });

    
  }

  vueStrap() {
        // :TODO
  }
}

