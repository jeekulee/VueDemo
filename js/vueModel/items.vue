<script>
	export default {
		props: ['links','title']
	}
</script>
<template>
	<div class="hmain_list">
		<div class="hmain_listbt"><a href="#" class="hleft"></a><span>{{title}}</span><a href="#" class="hright"></a></div>
		<ul>
			<li v-for="link in links">
				<a href="{{link.url}}">{{link.name}}</a>
			</li>
			<div style="clear:both;"></div>
		</ul>
	</div>
</template>