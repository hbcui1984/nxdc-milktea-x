<template>
	<view class="container">
		<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
			<view class="order-item" v-for="(item, index) in orderList" :key="index" style="margin-bottom: 30rpx;" @tap="detail(item.id)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column">
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;">
								{{ item.store.name }}
							</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item.order_no }}</view>
						</view>
						<view class="font-size-lg text-color-primary">
							{{ item.status_text }}
						</view>
					</view>
				</list-cell>
				<list-cell :hover="false" last>
					<view class="w-100 d-flex flex-column">
						<view class="w-100 text-truncate font-size-lg text-color-base" style="margin-bottom: 20rpx;">
							{{ orderGoodsName(item.goods) }}
						</view>
						<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
							<view class="font-size-sm text-color-assist">
								{{ formatDateTime(item.created_at) }}
							</view>
							<view class="d-flex font-size-sm text-color-base align-items-center">
								<view style="margin-right: 10rpx;">共{{ item.goods_num }}件商品，实付</view>
								<view class="font-size-lg">￥{{ item.amount }}</view>
							</view>
						</view>
						<view class="d-flex align-items-center justify-content-end">
							<view style="margin-right: 10rpx;">
								<button type="primary" plain size="mini" v-if="item.invoice_status > 0">查看发票</button>
								<button type="primary" plain size="mini" v-else @tap.stop="goToInvoice">开发票</button>
							</view>
							<view>
								<button type="primary" plain size="mini" @tap.stop="review(item)">去评价</button>
							</view>
						</view>
					</view>
				</list-cell>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
import listCell from '@/components/list-cell/list-cell'

const store = useStore()
const { proxy } = getCurrentInstance()

const page = ref(1)
const pageSize = ref(5)
const orderList = ref([])

const orderGoodsName = (goods) => {
	let arr = []
	goods.forEach(good => arr.push(good.name + '*' + good.number))
	return arr.join('，')
}

const formatDateTime = (datetime) => {
	return proxy.$util ? proxy.$util.formatDateTime(datetime) : datetime
}

const getOrders = async (isRefresh = false) => {
	uni.showLoading({
		title: '加载中'
	})

	let orders = await proxy.$api('orders')
	if (isRefresh) {
		orderList.value = []
		page.value = 1
	}
	orders = orders.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)
	if (orders.length) {
		orderList.value = orderList.value.concat(orders)
		page.value += 1
	}

	uni.hideLoading()
}

const detail = (id) => {
	uni.navigateTo({
		url: '/pages/orders/detail?id=' + id
	})
}

const review = (order) => {
	const date = order.completed_time.split(' ')[0]
	uni.navigateTo({
		url: '/pages/review/review?storename=' + order.store.name + '&typeCate=' + order.typeCate + '&date=' + date
	})
}

const goToInvoice = () => {
	uni.navigateTo({
		url: '/pages/invoice/invoice'
	})
}

onLoad(async () => {
	if (!store.getters.isLogin) {
		uni.navigateTo({ url: '/pages/login/login' })
	}
	await getOrders(false)
})

onReachBottom(async () => {
	await getOrders(false)
})

onPullDownRefresh(async () => {
	await getOrders(true)
})
</script>

<style lang="scss" scoped>

</style>
