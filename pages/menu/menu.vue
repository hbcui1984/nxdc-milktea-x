<template>
	<view class="container" v-if="!loading">
		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="header">
					<view class="left" v-if="orderType == 'takein'">
						<view class="store-name">
							<text>{{ storeInfo.name }}</text>
							<view class="iconfont iconarrow-right"></view>
						</view>
						<view class="store-location">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
							<text>距离您 {{ storeInfo.distance_text }}</text>
						</view>
					</view>
					<view class="left overflow-hidden" v-else>
						<view class="d-flex align-items-center overflow-hidden">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
							<view class="font-size-extra-lg text-color-base font-weight-bold text-truncate">
								{{ address.street }}
							</view>
						</view>
						<view class="font-size-sm text-color-assist overflow-hidden text-truncate">
							由<text class="text-color-base" style="margin: 0 10rpx">{{ storeInfo.name }}</text>配送
						</view>
					</view>
					<view class="right">
						<view class="dinein" :class="{active: orderType == 'takein'}" @tap="setOrderType('takein')">
							<text>自取</text>
						</view>
						<view class="takeout" :class="{active: orderType == 'takeout'}" @tap="takout">
							<text>外卖</text>
						</view>
					</view>
				</view>
				<view class="coupon">
					<text class="title">"霸气mini卡"超级购券活动，赶紧去购买</text>
					<view class="iconfont iconarrow-right"></view>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view class="menu" :id="`menu-${item.id}`" :class="{'current': item.id === currentCateId}" v-for="(item, index) in goods" 
						:key="index" @tap="handleMenuTap(item.id)">
							<text>{{ item.name }}</text>
							<view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view>
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
					<view class="wrapper">
						<swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper>
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
									<image :src="item.icon" class="icon"></image>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.goods_list" :key="key">
										<image :src="good.images" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.name }}</text>
											<text class="tips">{{ good.content }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.use_property">
													<button type="default" class="btn btn-primary property_btn" hover-class="none"
													 size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(good.id)" plain class="btn reduce_btn"
													 size="mini" hover-class="none" @tap="handleReduceFromCart(item, good)">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
													<button type="default" class="btn btn-primary add_btn" size="mini" hover-class="none" 
														@tap="handleAddToCart(item, good, 1)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<!-- content end -->
			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="default" class="pay-btn" @tap="toPay" :disabled="disabledPay">
					{{ disabledPay ? `差${spread}元起送` : '去结算' }}
				</button>
			</view>
			<!-- 购物车栏 end -->
		</view>
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" 
				width="90%" custom padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.images" :src="good.images" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.content }}</view>
					</view>
					<view class="properties" v-if="good.use_property">
						<view class="property" v-for="(item, index) in good.property" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.values" :key="key" 
								:class="{'default': value.is_default}" 
								@tap="changePropertyDefault(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ good.price }}</view>
					<view class="props" v-if="getGoodSelectedProps(good)">
						{{ getGoodSelectedProps(good) }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" 
						@tap="handlePropertyReduce">
						<view class="iconfont iconsami-select"></view>
					</button>
					<view class="number">{{ good.number }}</view>
					<button type="default" class="btn btn-primary" size="mini" hover-class="none" 
						@tap="handlePropertyAdd">
						<view class="iconfont iconadd-select"></view>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<!-- 商品详情模态框 end -->
		<!-- 购物车详情popup -->
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template #content>
				<view class="top">
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
						<view class="item" v-if="orderType == 'takeout' && storeInfo.packing_fee">
							<view class="left">
								<view class="name">包装费</view>
							</view>
							<view class="center">
								<text>￥{{ parseFloat(storeInfo.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">1</view>
								<button type="primary" class="btn" size="min" hover-class="none">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
		<!-- 购物车详情popup -->
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
import modal from '@/components/modal/modal'
import popupLayer from '@/components/popup-layer/popup-layer'

const store = useStore()
const { proxy } = getCurrentInstance()

const goods = ref([])
const ads = ref([
	{ image: 'https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600' },
	{ image: 'https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600' },
	{ image: 'https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600' },
	{ image: 'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600' },
	{ image: 'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600' }
])
const loading = ref(true)
const currentCateId = ref(6905)
const cateScrollTop = ref(0)
const menuScrollIntoView = ref('')
const cart = ref([])
const goodDetailModalVisible = ref(false)
const good = ref({})
const category = ref({})
const cartPopupVisible = ref(false)
const sizeCalcState = ref(false)

const orderType = computed(() => store.state.orderType)
const address = computed(() => store.state.address)
const storeInfo = computed(() => store.state.store)
const isLogin = computed(() => store.getters.isLogin)

const goodCartNum = (id) => {
	return cart.value.reduce((acc, cur) => {
		if (cur.id === id) {
			return acc += cur.number
		}
		return acc
	}, 0)
}

const menuCartNum = (id) => {
	return cart.value.reduce((acc, cur) => {
		if (cur.cate_id === id) {
			return acc += cur.number
		}
		return acc
	}, 0)
}

const getCartGoodsNumber = computed(() => {
	return cart.value.reduce((acc, cur) => acc + cur.number, 0)
})

const getCartGoodsPrice = computed(() => {
	return cart.value.reduce((acc, cur) => acc + cur.number * cur.price, 0)
})

const disabledPay = computed(() => {
	return orderType.value == 'takeout' && (getCartGoodsPrice.value < storeInfo.value.min_price) ? true : false
})

const spread = computed(() => {
	if (orderType.value != 'takeout') return
	return parseFloat((storeInfo.value.min_price - getCartGoodsPrice.value).toFixed(2))
})

const setOrderType = (type) => {
	store.commit('SET_ORDER_TYPE', type)
}

const getStore = () => {
	return store.dispatch('getStore')
}

const init = async () => {
	loading.value = true
	await getStore()
	goods.value = await proxy.$api('goods')
	loading.value = false
	cart.value = uni.getStorageSync('cart') || []
}

const takout = () => {
	if (orderType.value == 'takeout') return

	if (!isLogin.value) {
		uni.navigateTo({ url: '/pages/login/login' })
		return
	}

	uni.navigateTo({
		url: '/pages/address/address?is_choose=true'
	})
}

const handleMenuTap = (id) => {
	if (!sizeCalcState.value) {
		calcSize()
	}

	currentCateId.value = id
	nextTick(() => {
		const item = goods.value.find(item => item.id == id)
		if (item) {
			cateScrollTop.value = item.top
		}
	})
}

const handleGoodsScroll = ({ detail }) => {
	if (!sizeCalcState.value) {
		calcSize()
	}
	const { scrollTop } = detail
	let tabs = goods.value.filter(item => item.top <= scrollTop).reverse()
	if (tabs.length > 0) {
		currentCateId.value = tabs[0].id
	}
}

const calcSize = () => {
	let h = 10

	let view = uni.createSelectorQuery().select('#ads')
	view.fields({
		size: true
	}, data => {
		h += Math.floor(data.height)
	}).exec()

	goods.value.forEach(item => {
		let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
		view.fields({
			size: true
		}, data => {
			item.top = h
			h += data.height
			item.bottom = h
		}).exec()
	})
	sizeCalcState.value = true
}

const handleAddToCart = (cate, goodItem, num) => {
	const index = cart.value.findIndex(item => {
		if (goodItem.use_property) {
			return (item.id === goodItem.id) && (item.props_text === goodItem.props_text)
		} else {
			return item.id === goodItem.id
		}
	})
	if (index > -1) {
		cart.value[index].number += num
	} else {
		cart.value.push({
			id: goodItem.id,
			cate_id: cate.id,
			name: goodItem.name,
			price: goodItem.price,
			number: num,
			image: goodItem.images,
			use_property: goodItem.use_property,
			props_text: goodItem.props_text,
			props: goodItem.props
		})
	}
}

const handleReduceFromCart = (item, goodItem) => {
	const index = cart.value.findIndex(cartItem => cartItem.id === goodItem.id)
	cart.value[index].number -= 1
	if (cart.value[index].number <= 0) {
		cart.value.splice(index, 1)
	}
}

const showGoodDetailModal = (item, goodItem) => {
	good.value = JSON.parse(JSON.stringify({ ...goodItem, number: 1 }))
	category.value = JSON.parse(JSON.stringify(item))
	goodDetailModalVisible.value = true
}

const closeGoodDetailModal = () => {
	goodDetailModalVisible.value = false
	category.value = {}
	good.value = {}
}

const changePropertyDefault = (index, key) => {
	good.value.property[index].values.forEach(value => value.is_default = 0)
	good.value.property[index].values[key].is_default = 1
	good.value.number = 1
}

const getGoodSelectedProps = (goodItem, type = 'text') => {
	if (goodItem.use_property) {
		let props = []
		goodItem.property.forEach(({ values }) => {
			values.forEach(value => {
				if (value.is_default) {
					props.push(type === 'text' ? value.value : value.id)
				}
			})
		})
		return type === 'text' ? props.join('，') : props
	}
	return ''
}

const handlePropertyAdd = () => {
	good.value.number += 1
}

const handlePropertyReduce = () => {
	if (good.value.number === 1) return
	good.value.number -= 1
}

const handleAddToCartInModal = () => {
	const product = Object.assign({}, good.value, { props_text: getGoodSelectedProps(good.value), props: getGoodSelectedProps(good.value, 'id') })
	handleAddToCart(category.value, product, good.value.number)
	closeGoodDetailModal()
}

const openCartPopup = () => {
	cartPopupVisible.value = !cartPopupVisible.value
}

const handleCartClear = () => {
	uni.showModal({
		title: '提示',
		content: '确定清空购物车么',
		success: ({ confirm }) => {
			if (confirm) {
				cartPopupVisible.value = false
				cart.value = []
			}
		}
	})
}

const handleCartItemAdd = (index) => {
	cart.value[index].number += 1
}

const handleCartItemReduce = (index) => {
	if (cart.value[index].number === 1) {
		cart.value.splice(index, 1)
	} else {
		cart.value[index].number -= 1
	}
	if (!cart.value.length) {
		cartPopupVisible.value = false
	}
}

const toPay = () => {
	if (!isLogin.value) {
		uni.navigateTo({ url: '/pages/login/login' })
		return
	}

	uni.showLoading({ title: '加载中' })
	uni.setStorageSync('cart', JSON.parse(JSON.stringify(cart.value)))

	uni.navigateTo({
		url: '/pages/pay/pay'
	})
	uni.hideLoading()
}

onLoad(async () => {
	await init()
})
</script>

<style lang="scss" scoped>
	@import '~@/pages/menu/menu.scss';
</style>
