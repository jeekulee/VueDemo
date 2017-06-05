import _ from "underscore";
import Vue from "vue";
import favourMenu from 'vueModel/favourMenu.vue';


export default class FavourMenu {

    constructor(){
		
	}
	
	initMenu(){
		var me = this;
		this.inst = new Vue({
			el: '#favourMenu',
			components: {
				favourMenu: favourMenu
			},
			ready() {
				var that = this;
				//模拟AJAX
				setTimeout(function(){
						const testData = [{menuName:"test11",menuId:"112233",url:'test/test/test.html'},
										  {menuName:"test11",menuId:"112233",url:'test/test/test.html'},
										  {menuName:"test11",menuId:"112233",url:'test/test/test.html'},
										  {menuName:"test11",menuId:"112233",url:'test/test/test.html'}
										 ];
						that.$set('pfavourlist',testData);				
				},500);
			},
			events: {
				
			},
			data (){
				return {
					pfavourlist:{boardId:'testid',menuName:'test222'}
				}
			}
		});
	}
	
}



