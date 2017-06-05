<script>
	export default {
		props: ['menus','addflag'],
		methods : {
			forwardMenu(GROUP_ID,GROUP_NAME) {
				const target = event.target;
				$("#mainMenu li").removeClass("hmenu_bg");
				$(target.parentNode).addClass("hmenu_bg");
				
				const className = $(target).attr("class");
				$(target).removeClass(className).addClass(className+"_2");
				
				this.$dispatch('onMenuClick', {GROUP_ID,GROUP_NAME});
			},
			addMenu(){
				this.$set('addflag',false);
				this.$set('newMenuName','');
			    setTimeout(() => {
			       this.$el.querySelector('.addMenuSty').focus();
			    },500)
			},
			setNewMenu(newMenuName){
				this.$dispatch('setNewMenu',newMenuName,this);
			},
			hideAddBox(){
				if(event.relatedTarget !=null && event.relatedTarget.className == "button_tj" ){
			        return;
			    }
			    this.$set('newMenuName','');
			    this.$set('addflag',true);
			}
		}
	}
</script>
<template>
	<div class="hmenu">

		<div class="hmenu_search">
			<div class="dropdown-group" style="position:relative;float:left;">
				<div  class="hleft" data-toggle="dropdown"></div>
					<ul class="dropdown-menu" role="menu">
	                    <li>
	                        <a href="javascript:void(0);" @click="addMenu()">添加</a>
	                    </li>
	                    <li>
	                        <a href="javascript:void(0);" >编辑</a>
	                    </li>
	              </ul>
			</div>
			<input type="text" class="h_search"/>
		</div>
		<ul>
		   <li class="hmenu_input"  v-bind:class="{ hideDom:addflag }">
		   		<input type="text" class="addMenuSty" v-model="newMenuName" @blur="hideAddBox(newMenuName)" placeholder="请输入新增菜单名称..." value="" /><button type="button" class="button_tj" @click=setNewMenu(newMenuName)></button>
		   </li>
			<li v-for="menu in menus" >
				<a href="#" class="icon_04" v-on:click="forwardMenu(menu.GROUP_ID,menu.GROUP_NAME,this)">
				<span class="{{menu.ICON_CLS!=''?menu.ICON_CLS:'icon_05'}}"></span>
				{{menu.GROUP_NAME}}
				</a>
			</li>
			
		</ul>

	</div>
</template>