<template>
	<view>
		<slot></slot>
	</view>
</template>

<script setup>
import { ref, provide, getCurrentInstance } from 'vue'

/**
 * SwipeAction 滑动操作
 * @description 通过滑动触发选项的容器
 * @tutorial https://ext.dcloud.net.cn/plugin?id=181
 */

const instance = getCurrentInstance()
const children = ref([])

provide('swipeaction', {
	children,
	closeOther
})

function closeOther(vm) {
	children.value.forEach((item, index) => {
		if (vm === item) return
		// 支付宝执行以下操作
		// #ifdef MP-ALIPAY
		if (item.isopen) {
			item.close()
		}
		// #endif

		// app vue 端、h5 、微信、支付宝  执行以下操作
		// #ifdef APP-VUE || H5 || MP-WEIXIN
		let position = item.position[0]
		let show = position.show
		if (show) {
			position.show = false
		}
		// #endif

		// nvue 执行以下操作
		// #ifdef APP-NVUE || MP-BAIDU || MP-QQ || MP-TOUTIAO
		item.close()
		// #endif
	})
}
</script>

<style>

</style>
