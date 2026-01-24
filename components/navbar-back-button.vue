<template>
	<view class="position-absolute" :style="{zIndex: 99,height: height + 'px', top: top + 'px', left: left + 'px'}" @tap="click">
		<image src="/static/images/back.png" :style="{height: height + 'px', width: height + 'px'}"></image>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const height = ref(0)
const left = ref(0)
const top = ref(0)

onMounted(() => {
	//#ifdef MP-WEIXIN
	const menuButton = uni.getMenuButtonBoundingClientRect()
	const systemInfo = uni.getSystemInfoSync()
	top.value = menuButton.top
	left.value = systemInfo.windowWidth - menuButton.right
	height.value = menuButton.height
	//#endif
	//#ifndef MP-WEIXIN
	height.value = 32
	top.value = 26
	left.value = 10
	//#endif
})

const click = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
</style>
