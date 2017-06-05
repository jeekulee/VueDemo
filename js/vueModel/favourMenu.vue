<script>
	export default {
		props: ['favourlist'],
		methods : {
			forwardMenu(url,urlId) {
				this.$dispatch('onMenuClick', {boardId:boardId});
			}
		}
	}
</script>
<template>
<div class="hmain_common_bt"><a href="#"></a><span>常用菜单</span></div>
<ul>
	<li class="hbutton_red" v-for="menu in favourlist" ><a href="{{menu.url}}" v-on:click="forwardMenu(menu.url,menu.menuId)">{{menu.menuName}}</a></li>
</ul>
</template>