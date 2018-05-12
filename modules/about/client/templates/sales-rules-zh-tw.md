### :orange_book: 種子促銷細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供多種種子促銷手段，管理員可以對每個種子設定不同的促銷級別，站點也可能會在一個特殊的時間推出一個特別的促銷活動，具體的促銷活動請注意站內的訊息通知。

&emsp;

#### :white_small_square: 促銷標籤說明
&emsp;&emsp;在種子列表或詳情頁面，促銷的種子會有一個 <mark>綠色</mark> 的促銷標籤，可能會是下面列表中的一項：


標籤 | 說明 | 標籤 | 說明
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

#### :white_small_square: 促銷細則
1. 每個種子促銷時間的長短由種子大小自動決定，當前系統設定為：每 `%(salesTypeConfig.expires.size_str)s` 促銷 `%(salesTypeConfig.expires.time_str)s` 小時，促銷過期後促銷標籤自動消失。
1. 站點也可能會在一個特殊的時間推出一個特別的全侷促銷活動，活動通知會在活動開始前在站點首頁上方突出顯示。
1. 當種子被管理員設定為促銷時，系統會向種子上傳者傳送訊息通知。

&emsp;

&emsp;&emsp;<span class="text-danger">**注意: 促銷只會影響您的上傳下載計量，系統根據實際的上傳下載量計算您的積分。**</span>