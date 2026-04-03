# uni-app x 升级复盘总结

## 项目概述
- **项目**: 奶茶点餐应用 (nxdc-milktea-x)
- **升级路径**: uni-app Vue 3 → uni-app x
- **页面数量**: 30 个页面
- **耗时**: 消耗大量 token，多轮编译调试

---

## 一、本次升级完成的工作

### 1. 文件格式转换
- `.vue` → `.uvue` (30个页面 + 6个组件)
- `main.js` → `main.uts`
- `store/index.js` → `store/index.uts`
- `App.vue` → `App.uvue`

### 2. 删除不兼容内容
- 删除 `api/` 目录 (mock 数据)
- 删除 `store/index.js` (Vuex)
- 删除不兼容组件: `jyf-parser`, `uni-swipe-action`, `uni-steps`, `uni-icons`
- 删除 `vite.config.js`, `index.html`

### 3. 类型系统重构
- 在 `store/index.uts` 中定义所有业务类型
- 为所有 `computed` 添加显式返回类型
- 为所有函数参数和返回值添加类型

---

## 二、犯的错误与浪费的时间

### 错误 1: 反复尝试事件类型 (严重浪费)
**问题**: `PickerChangeEvent` 类型找不到

**错误尝试过程**:
1. 先用 `PickerChangeEvent` → 报错
2. 改成 `UniPickerChangeEvent` → 还是报错
3. 改成 `UniEvent` + 类型断言 → 报错
4. 改成 `any` → 报错 (UTS 不支持 any 访问属性)
5. 最后定义本地 `type` → 成功

**正确做法**: 一开始就应该定义本地类型
```typescript
type PickerEventDetail = { value: string }
type PickerEvent = { detail: PickerEventDetail }
const handleDateChange = (e: PickerEvent) => {
  birthday.value = e.detail.value
}
```

**教训**: UTS 中遇到全局类型找不到时，直接定义本地类型，不要反复尝试各种全局类型名称。

---

### 错误 2: 未一次性理解 UTS 函数声明顺序规则
**问题**: 多个文件都出现 "函数在定义前被调用" 错误

**发生的文件**:
- `pages/coupons/coupons.uvue` - `filterCoupons` 
- `pages/menu/menu.uvue` - `calcSize`
- `pages/pay/pay.uvue` - `pay`

**教训**: UTS 要求函数必须先定义后调用（类似 C 语言），这是与 JavaScript 的根本区别。应该在第一次遇到时就记住，后续同类错误直接修复。

---

### 错误 3: computed 返回类型修复方式不统一
**问题**: 多次尝试不同的 computed 类型写法

**正确写法** (应该一开始就统一使用):
```typescript
const currentAddress = computed((): AddressType | null => {
  return state.address
})
```

---

### 错误 4: 编译输出过长导致无效等待
**问题**: 每次编译输出大量 CSS warnings，需要过滤才能看到真正的错误

**教训**: 编译时直接用 grep 过滤:
```bash
cli launch app-android --project xxx --compile true 2>&1 | grep -E "(error|Error|错误|失败|编译成功)"
```

---

## 三、经验教训清单 (下次升级必读)

### UTS 类型规则速查表

| 场景 | JavaScript | UTS 正确写法 |
|------|------------|--------------|
| 函数声明顺序 | 可以先调用后定义 | **必须先定义后调用** |
| computed 返回类型 | 自动推断 | `computed((): Type \| null => {})` |
| 事件类型找不到 | - | 定义本地 `type`，不要猜全局类型名 |
| JSON.parse 返回值 | 自动推断 | `JSON.parse(str) as MyType` |
| 布尔判断 | `!someNumber` | `someNumber == 0` |
| 数组可能为空 | `arr[0]` | `arr.length > 0 ? arr[0] : null` |
| 对象可能为 null | `obj.prop` | `obj != null ? obj.prop : default` |

### 常见类型替换表

| 原类型 | UTS 替换方案 |
|--------|-------------|
| `any` | 定义具体 `type` |
| `PickerChangeEvent` | 定义本地 `type PickerEvent = { detail: { value: string } }` |
| `ShowModalSuccess` | `ShowModalResult`，且 `res.confirm == true` |
| `UniPickerChangeEvent` | 如果报错，改用本地 type |

### 编译调试技巧

```bash
# 只看错误，忽略 CSS warnings
cli launch app-android --project /path/to/project --compile true 2>&1 | grep -E "(error|Error|错误|失败)"

# 查看错误上下文
cli launch app-android --project /path/to/project --compile true 2>&1 | grep -B5 "error:"
```

---

## 四、下次升级的正确流程

### 第一步: 批量文件转换
```bash
# 重命名所有 .vue 为 .uvue
find pages components -name "*.vue" -exec sh -c 'mv "$1" "${1%.vue}.uvue"' _ {} \;

# 重命名 main.js 和 store
mv main.js main.uts
mv store/index.js store/index.uts
mv App.vue App.uvue
```

### 第二步: 删除不兼容内容
- 删除 `api/` (如果是 mock 数据)
- 删除 Vuex store (用 reactive 替代)
- 删除 `vite.config.js`, `index.html`
- 删除依赖 DOM 的组件 (jyf-parser 等)

### 第三步: 预处理所有页面 (在编译前)
在每个 `.uvue` 文件中:
1. 检查所有函数调用，确保被调用的函数定义在调用之前
2. 为所有 `computed` 添加返回类型: `computed((): Type | null => {})`
3. 为事件处理函数定义本地类型，不依赖全局事件类型
4. 将 `!someNumber` 改为 `someNumber == 0`
5. 为 `JSON.parse()` 添加类型断言

### 第四步: 编译验证
```bash
# 一次编译，过滤错误
cli launch app-android --project /path --compile true 2>&1 | grep "error"
```

### 第五步: 按错误类型批量修复
不要逐个文件修，而是按错误类型批量修复:
1. 先修所有 "函数未定义" 错误
2. 再修所有 "类型不匹配" 错误
3. 最后修特殊情况

---

## 五、结论

本次升级最大的问题是 **试错太多**，尤其是在事件类型处理上反复尝试了 5 种写法才找到正确方案。

**核心教训**: UTS 不是 TypeScript，它更接近强类型语言。遇到类型问题时，优先定义本地类型，不要猜测全局类型名称。

下次升级时，应该先阅读本文档，按照预处理步骤在编译前就修复已知问题，避免反复编译调试。
