<template>
	<view class="container d-flex flex-column">
		<view class="flex-fill form">
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">昵称</view>
					<view class="input flex-fill">
						<input type="text" placeholder="请填写昵称" placeholder-class="text-color-assist font-size-base" 
						v-model="member.nickname">
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">手机号码</view>
					<view class="input flex-fill">
						<input type="text" v-model="member.mobilePhone" disabled>
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">性别</view>
					<view class="input flex-fill">
						<view class="radio-group">
							<view class="radio" :class="{'checked': member.gender == '1'}" style="margin-right: 10rpx;" @tap="member.gender=1">先生</view>
							<view class="radio" :class="{'checked': member.gender == '2'}" @tap="member.gender=2">女士</view>
						</view>
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false" :arrow="!member.birthday">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">生日</view>
					<view class="input flex-fill">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" v-if="!member.birthday" @change="handleDateChange">
							生日当天有惊喜
						</picker>
						<input type="text" v-else :value="member.birthday" disabled>
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false" last>
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">入会时间</view>
					<view class="input flex-fill">
						<input type="text" v-model="member.openingCardDate" disabled>
					</view>
				</view>
			</list-cell>
		</view>
		<view class="btn-box d-flex align-items-center just-content-center">
			<button type="primary" class="save-btn" @tap="save">保存</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useStore } from 'vuex'
import listCell from '@/components/list-cell/list-cell'

const store = useStore()

const getDate = (type) => {
	const date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()

	if (type === 'start') {
		year = year - 60
	} else if (type === 'end') {
		year = year + 2
	}
	month = month > 9 ? month : '0' + month
	day = day > 9 ? day : '0' + day
	return `${year}-${month}-${day}`
}

const member = reactive({})
const date = ref(getDate('format'))

const startDate = computed(() => getDate('start'))
const endDate = computed(() => getDate('end'))

onLoad(() => {
	Object.assign(member, store.state.member)
})

const handleDateChange = (e) => {
	member.birthday = e.target.value
}

const save = () => {
	const updatedMember = Object.assign(store.state.member, member)
	store.commit('SET_MEMBER', updatedMember)
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}

.container {
	padding: 20rpx 30rpx;
}

.form {
	border-radius: 8rpx;
}

.form-input {
	.label {
		width: 160rpx;
		font-size: $font-size-base;
		color: $text-color-base;
	}
	
	.input {
	}
	
	.radio-group {
		display: flex;
		justify-content: flex-start;
		
		.radio {
			padding: 10rpx 30rpx;
			border-radius: 6rpx;
			border: 2rpx solid $text-color-assist;
			color: $text-color-assist;
			font-size: $font-size-base;
			
			&.checked {
				background-color: $color-primary;
				color: $text-color-white;
				border: 2rpx solid $color-primary;
			}
		}
	}
}

.btn-box {
	height: calc((100vh - 40rpx) / 2);
}

.save-btn {
	width: 90%;
	border-radius: 50rem !important;
	font-size: $font-size-lg;
}
</style>
