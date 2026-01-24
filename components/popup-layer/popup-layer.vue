<template>
	<view>
		<view v-show="ifshow" @tap="ableClose" @touchmove.stop.prevent class="popup-layer" >
		</view>
		<view class="popup-content" @tap.stop="stopEvent" :style="_location">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
	showPop:{
		type:Boolean,
		default:false,
	},
	direction: {
		type: String,
		default: 'top', // 方向  top，bottom，left，right 
	},
	autoClose: {
		type: Boolean,
		default: true,
	}
})

const emit = defineEmits(['closeCallBack', 'update:showPop'])

const ifshow = ref(false)
//#ifdef H5
const translateValue = ref(-150)
//#endif
//#ifndef H5
const translateValue = ref(-100)
//#endif
const timer = ref(null)
const iftoggle = ref(false)

const _translate = computed(() => {
	const transformObj = {
		'top': `transform:translateY(${-translateValue.value}%)`,
		'bottom': `transform:translateY(${translateValue.value}%)`,
		'left': `transform:translateX(${-translateValue.value}%)`,
		'right': `transform:translateX(${translateValue.value}%)`
	}
	return transformObj[props.direction]
})

const _location = computed(() => {
	const positionValue = {
		//#ifndef H5
		'top': 'bottom:0px;width:100%;',
		//#endif
		 //#ifdef H5
		'top': 'bottom:50px;width:100%;',
		 //#endif
		'bottom': 'top:0px;width:100%;',
		'left': 'right:0px;height:100%;',
		'right': 'left:0px;height:100%;',
	}
	return positionValue[props.direction] + _translate.value
})

onMounted(() => {
	if(props.showPop){
		show()
	}
})

watch(() => props.showPop, (value) => {
	console.log(value)
	if(value){
		show()
	}else{
		close()
	}
})

const stopMove = (event) => {
	console.log(11)
	console.log(event)
	return
}

const show = (events) => {
	ifshow.value = true
	let _open = setTimeout(() => {
		translateValue.value = 0
		_open = null
	}, 100)
	let _toggle = setTimeout(() => {
		iftoggle.value = true
		_toggle = null
	}, 300)
}

const close = () => {
	if (timer.value !== null || !iftoggle.value) {
		return
	}
	translateValue.value = -100
	//#ifdef H5
	translateValue.value = -150
	//#endif
	timer.value = setTimeout(() => {
		ifshow.value = false
		timer.value = null
		iftoggle.value = false
		emit('closeCallBack', null)
		emit('update:showPop', false)
	}, 300)
}

const ableClose = () => {
	if (props.autoClose) {
		close()
	}
}

const stopEvent = (event) => {}

const doSome = () => {
	console.log(111222111111111)
}

// Expose methods for parent component access
defineExpose({
	show,
	close
})
</script>

<style lang="scss">
	.popup-layer {
		position: fixed;
		z-index: 9990;
		background: rgba(0, 0, 0, .3);
		height: 100%;
		width: 100%;
		top: 0px;
		left: 0px;
		overflow: hidden;
	}

	.popup-content {
		position: fixed;
		z-index: 9991;
		background: #FFFFFF;
		transition: all .3s ease;
		overflow: hidden;
		box-sizing: border-box;
		// border:1px solid red;
	}
</style>
