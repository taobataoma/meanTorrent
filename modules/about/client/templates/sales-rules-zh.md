### :orange_book: 种子促销细则 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供多种种子促销手段，管理员可以对每个种子设置不同的促销级别，站点也可能会在一个特殊的时间推出一个特别的促销活动，具体的促销活动请注意站内的消息通知。

&emsp;

#### :white_small_square: 促销标签说明
&emsp;&emsp;在种子列表或详情页面，促销的种子会有一个 <mark>绿色</mark> 的促销标签，可能会是下面列表中的一项：


标签 | 说明 | 标签 | 说明
- | - | - | -
`%(salesTypeConfig.value[0].name)s` | %(salesTypeConfig.value[0].desc)s | `%(salesTypeConfig.value[1].name)s` | %(salesTypeConfig.value[1].desc)s
`%(salesTypeConfig.value[2].name)s` | %(salesTypeConfig.value[2].desc)s | `%(salesTypeConfig.value[3].name)s` | %(salesTypeConfig.value[3].desc)s
`%(salesTypeConfig.value[4].name)s` | %(salesTypeConfig.value[4].desc)s | &nbsp; | &nbsp;
`%(salesTypeConfig.value[5].name)s` | %(salesTypeConfig.value[5].desc)s | `%(salesTypeConfig.value[6].name)s` | %(salesTypeConfig.value[6].desc)s
`%(salesTypeConfig.value[7].name)s` | %(salesTypeConfig.value[7].desc)s | `%(salesTypeConfig.value[8].name)s` | %(salesTypeConfig.value[8].desc)s
`%(salesTypeConfig.value[9].name)s` | %(salesTypeConfig.value[9].desc)s | &nbsp; | &nbsp;
`%(salesTypeConfig.value[10].name)s` | %(salesTypeConfig.value[10].desc)s | `%(salesTypeConfig.value[11].name)s` | %(salesTypeConfig.value[11].desc)s
`%(salesTypeConfig.value[12].name)s` | %(salesTypeConfig.value[12].desc)s | `%(salesTypeConfig.value[13].name)s` | %(salesTypeConfig.value[13].desc)s
`%(salesTypeConfig.value[14].name)s` | %(salesTypeConfig.value[14].desc)s | &nbsp; | &nbsp;

&emsp;

#### :white_small_square: 促销细则
1. 每个种子促销时间的长短由种子大小自动决定，当前系统设置为：每 `%(salesTypeConfig.expires.size_str)s` 促销 `%(salesTypeConfig.expires.time_str)s` 小时，促销过期后促销标签自动消失。
1. 站点也可能会在一个特殊的时间推出一个特别的全局促销活动，活动通知会在活动开始前在站点首页上方突出显示。
1. 当种子被管理员设置为促销时，系统会向种子上传者发送消息通知。

&emsp;

&emsp;&emsp;<span class="text-danger">**注意: 促销只会影响您的上传下载计量，系统根据实际的上传下载量计算您的积分。**</span>