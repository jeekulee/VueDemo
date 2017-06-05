<script>
import kjdpAjax from 'util/ajax';
import constans from 'util/constans';
	export default {
		props: ['menuTree','modalstitle'],
        data () {
                return {
                    menuTree:[],
                    modalstitle:''
                }
        },
        ready() {

            let zTreeCheck=this.getMenuData;
            let setting = {
              data: {
                simpleData: {
                  enable: true,
                  idKey: 'id',
                  pIdKey: 'pId',
                  rootPId: null
                }
              },
              check: {
                chkStyle: 'checkbox',
                enable: true,
                chkboxType: { Y: 'ps', N: 'ps' }
              },
              callback: {
                onCheck: zTreeCheck
              }
            };

            let data ={
                "linkTree" : [
                    {"MENU_ID":"1", "PAR_MENU":"-1", "MENU_NAME":"总部", "MENU_LINK": "http://www.baidu.com" },
                    {"MENU_ID":"2", "PAR_MENU":"1", "MENU_NAME":"区域一", "MENU_LINK": "http://www.baidu.com" },
                    {"MENU_ID":"3", "PAR_MENU":"1", "MENU_NAME":"区域二", "MENU_LINK": "http://www.baidu.com" },
                    {"MENU_ID":"4", "PAR_MENU":"-1", "MENU_NAME":"区域三", "MENU_LINK": "http://www.baidu.com" },
                    {"MENU_ID":"5", "PAR_MENU":"4", "MENU_NAME":"区域四", "MENU_LINK": "http://www.baidu.com" },
                    {"MENU_ID":"6", "PAR_MENU":"4", "MENU_NAME":"区域五", "MENU_LINK": "http://www.baidu.com" }
                ]
            }

            if(!data.linkTree){
                return false;
            }
            let zNodes = [];
            $.each(data.linkTree ,function (i,sData) {
               zNodes.push({ id: sData.MENU_ID, pId: sData.PAR_MENU, name: sData.MENU_NAME, link: sData.MENU_LINK });
            }) 
            $.fn.zTree.init($('#menuTree'), setting, zNodes);


          
            //   // 测试获取KJDPAJAX
            // kjdpAjax.post({
            //   req: {
            //     service: 'Y1001000',
            //     MENU_PUR: constans.kjdpConst.MENU_PUR_ALL
            //   }
            // }).then((data) => {
            //   let zNodes = [];
            //   for (let sData of data[0]) {
            //     zNodes.push({ id: sData.MENU_ID, pId: sData.PAR_MENU, name: sData.MENU_NAME, link: sData.MENU_LINK });
            //   }
            //   $.fn.zTree.init($('#menuTree'), setting, zNodes);
            // });
        },
		methods : {
            getMenuData(selecteData){
                this.$dispatch('popupButtonRight',selecteData);
            },
            modalCancel(target){
                let treeObj = $.fn.zTree.getZTreeObj('menuTree');
                let nodes = treeObj.getCheckedNodes();
                let nodesIndex='';
                $.each(nodes,(index,cont)=>{
                    if(target.linkId==cont.id){
                        nodesIndex=index;
                    }
                })
                treeObj.checkNode(nodes[nodesIndex],false, true, true);
            },
            getModal(titlecont,menuTree){
                this.$dispatch('setModalMeg',{title:titlecont,list:menuTree});
            },
            cancelModal(){
                this.$dispatch('cancelModal');
            },
            resetModal(){
                  this.$dispatch('onReset');
            }
		}
	}
</script>
<template>
 <!-- 模态框（Modal） -->
    <div class="modal fade" id="boxItemWindow" data-keyboard="false" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="popup">
                    <div class="popup_bt"><span>添加模版</span><button type="button" data-dismiss="modal"  
                    aria-hidden="true" v-on:click="cancelModal"></button></div>
                    <div class="popup_ul">
                        <div class="popup_ulname"><span>模块名称：</span><input modelId="{{modalstitle.id}}" type="text" class="popup_input" 
                        v-model="modalstitle.name" placeholder="请输入模块名称"/></div>
                        <div class="popup_ulbox">
                            <div class="popup_ulleft">
                                <div class="popup_listbt"><span>菜单库</span><input name="" type="text" class="popup_search"/></div>
                                <div class="ulbox">
                                    <ul id="menuTree" class="ztree"></ul>
                                </div>
                            </div>
                            <div class="popup_ulcenter"><span class="popup_buttonright"></span></div>
                            <div class="popup_ulright">
                                <div class="popup_listbt"><span>已选择</span></div>
                                 <div class="ulbox">
                                    <ul>
                                    	<li v-for="(i,cont) in menuTree">
                                    		<span  name='{{cont.link}}'>{{cont.name}}
                                            <button type="button" v-on:click='modalCancel(cont)'>X</button></span>
                                    	</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="popup_bottom"><button type="button" class="popup_reset" v-on:click="resetModal()">重置</button><button type="button" class="popup_add" v-on:click="getModal(modalstitle,menuTree)">确定</button></div>
                </div>
            </div>
        </div>
</template>