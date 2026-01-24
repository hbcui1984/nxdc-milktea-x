<template>
	<view class="w-100 h-100">
		<image :src="packageData.image" class="w-100" style="height: 50vh;"></image>
		<view style="padding: 30rpx 40rpx; padding-bottom: 100rpx;">
			<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 20rpx;">
				<view class="font-size-lg">{{ packageData.title }}</view>
				<view class="text-color-primary font-size-sm">购买记录</view>
			</view>
			<view class="text-color-assist font-size-sm" style="margin-bottom: 20rpx;">
				共{{couponNum}}张优惠券
			</view>
			<!-- 优惠券列表 begin -->
			<view class="d-flex flex-column w-100">
				<view class="coupon d-flex flex-column bg-white" v-for="(couponItem, index) in packageData.coupons" :key="index" @tap="openCouponDetailModal(couponItem)">
					<view class="d-flex flex-fill overflow-hidden" style="margin-bottom: 20rpx;">
						<image :src="couponItem.detail.image" style="margin-right: 40rpx;width: 150rpx; height: 150rpx;"></image>
						<view class="flex-fill flex-column justify-content-start overflow-hidden">
							<view class="text-right text-color-assist">x{{ couponItem.coupon_num }}</view>
							<view class="text-truncate font-size-extra-lg text-color-base w-80">
								{{ couponItem.detail.coupon_title }}
							</view>
							<view class="font-size-sm text-color-assist">{{ couponItem.detail.expire }}</view>
						</view>
					</view>
					<view class="bottom d-flex font-size-sm justify-content-between align-items-center">
						<view class="text-color-assist">
							使用时段：{{ couponItem.detail && couponItem.detail.coupon_use_time[0].use_time_start}}-{{couponItem.detail && couponItem.detail.coupon_use_time[0].use_time_end}}
						</view>
						<view class="text-color-primary">
							查看详情
						</view>
					</view>
				</view>
			</view>
			<!-- 优惠券列表 end -->
			<view class="font-size-extra-lg" style="margin-bottom: 40rpx;">购买须知</view>
			<view class="font-size-base text-color-base">
				售卖时间：{{ packageData.start_at.split(' ')[0] }}~{{ packageData.end_at.split(' ')[0] }}
			</view>
			<view class="font-size-base text-color-base" style="margin-bottom: 30rpx;">
				购买限制：无限制
			</view>
			<view class="font-size-sm text-color-assist pre-line">
				{{ packageData.content }}
			</view>
		</view>
		<view class="pay-box d-flex just-content-center align-items-center position-fixed fixed-bottom bg-white">
			<button type="primary" class="pay-btn font-size-base text-color-white rounded-pill"
				style="width: 90%;height: 80rpx; line-height: 80rpx;">
				￥{{ packageData.amount }}购买
			</button>
		</view>
		<modal custom :show="couponDetailModalShow" @cancel="closeCouponDetailModal">
			<view class="d-flex flex-column">
				<view class="text-center font-size-extra-lg text-color-base" style="margin-bottom: 30rpx;">
					{{ coupon.detail.coupon_title }}
				</view>
				<view class="text-center font-size-sm text-color-assist" style="margin-bottom: 40rpx;">
					{{ coupon.detail.expire }}
				</view>
				<view class="text-color-assist font-size-sm pre-line">
					{{ coupon.detail.desc }}
				</view>
			</view>
		</modal>
	</view>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import modal from '@/components/modal/modal'

const { proxy } = getCurrentInstance()

const packageData = ref({
	start_at: '',
	end_at: ''
})
const coupon = ref({
	detail: {}
})
const couponDetailModalShow = ref(false)

const couponNum = computed(() => {
	return packageData.value.coupons && packageData.value.coupons.reduce((acc, c) => acc + c.coupon_num, 0)
})

const openCouponDetailModal = (couponItem) => {
	coupon.value = couponItem
	couponDetailModalShow.value = true
}

const closeCouponDetailModal = () => {
	couponDetailModalShow.value = false
}

onLoad(async (option) => {
	const packages = await proxy.$api('packages')
	packageData.value = packages.filter(item => item.id == option.id)[0]
})
</script>

<style lang="scss">
.pay-box {
	padding: 10rpx 0;
	height: 100rpx;
}

.coupon {
	border-radius: 6rpx;
	padding: 20rpx 40rpx; 
	margin-bottom: 40rpx;
	box-shadow: $box-shadow;
	position: relative;
	
	&::before {
		content: " ";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: 70rpx;
		left: -15rpx;
		border-radius: 100%;
	}
	
	&::after {
		content: " ";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: 70rpx;
		right: -15rpx;
		border-radius: 100%;
	}
	
	.bottom {
		height: 70rpx;
		position: relative;
		
		&::before {
			content: '';
			border-top: 2rpx dashed #E2E2E2;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			transform: scaleY(0.2);
		}
	}
}
</style>
