# nxdc-milktea-x

本项目是使用 [uni-agent](https://uniapp.dcloud.net.cn/ai/uni-agent.html) 从 [https://github.com/hbcui1984/nxdc-milktea](https://github.com/hbcui1984/nxdc-milktea) 升级而来的 `uni-app x` 版本。

## 项目关系

| 项目 | 仓库地址 | 技术版本 |
|------|----------|----------|
| 原项目 | [https://github.com/hbcui1984/nxdc-milktea](https://github.com/hbcui1984/nxdc-milktea) | `uni-app` Vue 3 版本 |
| 当前项目 | [https://github.com/hbcui1984/nxdc-milktea-x](https://github.com/hbcui1984/nxdc-milktea-x) | `uni-app x` 版本 |

## 升级目标

- 保持原项目的页面结构与主要业务场景
- 完成从 `uni-app` 到 `uni-app x` 的迁移与适配
- 以 `uvue` / `uts` 形式重建页面与本地数据层

## 功能范围

- 首页
- 点餐
- 取餐
- 我的
- 会员码
- 卡券
- 地址
- 订单
- 积分相关页面
- 礼品卡、发票、服务等页面

## 数据说明

- 当前项目主要使用本地静态模拟数据
- 数据文件位于 `api/*.uts`

## 备注

- 提交到 GitHub 的 `manifest.json` 中 `appid` 为空，避免提交本地应用标识
- 如需本地运行 App，可在本地自行补充 `appid`
