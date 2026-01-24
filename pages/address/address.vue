<template>
	<view class="container">
		<view class="main">
			<view v-if="!addresses.length" class="no-address-tips">
				<view class="mb-30">暂无地址信息</view>
				<view>请点击底部按钮添加地址信息</view>
			</view>
			<template v-else>
				<uni-swipe-action>
					<uni-swipe-action-item class="address-wrapper" :options="swipeOption" @click="handleSwipeClick(address.id)" v-for="(address, index) in addresses" :key="index">
						<view class="address" @tap="chooseAddress(address)">
							<view class="left flex-fill overflow-hidden mr-20">
								<view class="font-size-lg font-weight-bold text-truncate" style="margin-bottom: 10rpx;">{{ address.street }}</view>
								<view class="font-size-sm text-color-assist">
									{{ address.accept_name }} {{ !address.gender ? '先生' : '女士' }} {{ address.mobile }}
								</view>
							</view>
							<image src="/static/images/edit.png" class="edit-icon" @tap.stop="edit(address.id)"></image>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</template>
		</view>
		<view class="btn-box">
			<button type="primary" size="default" @tap="add">新增地址</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
import uniSwipeAction from '../../components/uni-swipe-action/uni-swipe-action'
import uniSwipeActionItem from '../../components/uni-swipe-action-item/uni-swipe-action-item'

const store = useStore()

const scene = ref('menu')
const is_choose = ref(false)
const swipeOption = ref([
	{
		text: '删除',
		style: {
			backgroundColor: '#D12E32'
		}
	}
])

const addresses = computed(() => store.state.addresses)

onLoad((options) => {
	is_choose.value = options.is_choose || false
	scene.value = options.scene || 'menu'
})

const add = () => {
	uni.navigateTo({
		url: '/pages/address/add'
	})
}

const edit = (id) => {
	uni.navigateTo({
		url: '/pages/address/add?id=' + id
	})
}

const handleSwipeClick = (id) => {
	uni.showModal({
		title: '提示',
		content: '确定要删除？',
		success: res => {
			if(res.confirm) {
				const index = addresses.value.findIndex(item => item.id == id)
				const newAddresses = JSON.parse(JSON.stringify(addresses.value))
				newAddresses.splice(index, 1)
				store.commit('SET_ADDRESSES', newAddresses)
				uni.showToast({title: '删除成功！', icon: 'success'})
			}
		}
	})
}

const chooseAddress = (address) => {
	if(!is_choose.value) return
	store.commit('SET_ADDRESS', address)
	store.commit('SET_ORDER_TYPE', 'takeout')
	if(scene.value == 'menu') {
		uni.switchTab({
			url: '/pages/menu/menu'
		})
	} else if(scene.value == 'pay') {
		uni.navigateTo({
			url: '/pages/pay/pay'
		})
	}
}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
	}
	
	.main {
		width: 100%;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		padding-bottom: 100rpx;
		
		.address-wrapper {
			margin-bottom: 30rpx;
		}
		
		.address {
			width: 100%;
			padding: 40rpx 30rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.right {
				flex: 1;
				overflow: hidden;
				display: flex;
				flex-direction: column;
			}
			
			.edit-icon {
				width: 50rpx;
				height: 50rpx;
				flex-shrink: 0;
			}
		}
	}
	
	.btn-box {
		height: 100rpx;
		background-color: #FFFFFF;
		box-shadow: 0 0 20rpx rgba($color: $text-color-assist, $alpha: 0.1);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		
		button {
			height: 80rpx;
			width: 80%;
			border-radius: 50rem !important;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
