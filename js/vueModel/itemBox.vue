<script>
	export default {
		props: ['leftLinks','rightLinks','tabId'],
		methods: {
			forwardLink(linkId,tabId){
				this.$dispatch('onLinkClick', {linkId:linkId,tabId:tabId});
			},
			showModal(){
			    this.$dispatch('onModalClick');
			},
			removeItemBox(boxItem,direction,boxId){
            	this.$dispatch('removeItemBox',boxItem,direction,boxId);
            },
            boxEditor(linksData){
            	this.$dispatch('boxEditor',linksData);
            }
		}
	}
</script>
<template>
<div class="hmain" >
	<div class="hmain_margin">
		<div class="hmain_left" id="{{tabId+'left-events'}}" >
						
			<div class="hmain_list" v-for="(key,links) in leftLinks" tabId="{{tabId}}" boxId="{{links.BOX_ID}}" >
				<div class="hmain_listbt">
				<div style="display:none" v-bind:class="{ boxHL:links.BOXFLAG }" ></div>
				<span class="itemBoxTitle">{{links.BOX_NAME}}</span>
				        <div class="dropdown-group hright">
                                        <img class="dropdown-img" src="../../images/icon_cz.png" data-toggle="dropdown">
                                        </img>
                                        <ul class="dropdown-menu" style="right:0;" role="menu">
                                            <li>
                                                <a href="javascript:void(0);" @click="boxEditor(links)">编辑</a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);" @click="removeItemBox(key,'left',links.BOX_ID)">删除</a>
                                            </li>
                                        </ul>
                        </div>
				</div>
				<ul>
					<li v-for="link in links.menuLinks">
						<a href="#{{link.url}}" v-on:click="forwardLink(link.LINK_ID,tabId)" >{{link.LINK_NAME}}</a>
					</li>
					<div style="clear:both;"></div>
				</ul>
			</div>
			<div class="hmain_list_add" v-on:click="showModal()"><a href="#"></a></div>
		</div>
		<div class="hmain_right" id="{{tabId+'right-events'}}" style="min-height:200px">
			
			<div class="hmain_list" v-for="(key,links) in rightLinks" tabId="{{tabId}}" boxid="{{links.BOX_ID}}" >
				<div class="hmain_listbt">
				<div style="display:none" v-bind:class="{ boxHL:links.BOXFLAG }" ></div>
				<span class="itemBoxTitle">{{links.BOX_NAME}}</span>
				        <div class="dropdown-group hright">
                                        <img class="dropdown-img" src="../../images/icon_cz.png" data-toggle="dropdown">
                                        </img>
                                        <ul class="dropdown-menu" style="right:0;" role="menu">
                                            <li>
                                                <a href="javascript:void(0);" @click="boxEditor(links)">编辑</a>
                                            </li>
                                            <li>
                                                <a href="javascript:void(0);" @click="removeItemBox(key,'right',links.BOX_ID)">删除</a>
                                            </li>
                                        </ul>
                        </div>
				</div>
				<ul>
					<li v-for="link in links.menuLinks">
						<a href="#{{link.LINK_URL}}" v-on:click="forwardLink(link.LINK_ID,tabId)">{{link.LINK_NAME}}</a>
					</li>
					<div style="clear:both;"></div>
				</ul>
			</div>
		</div>
	</div>
</div>
</template>