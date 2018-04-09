### :orange_book: 做种与下载细则 - %(appConfig.name)s
---
**%(appConfig.name)s** 是一个自由分享资源的平台，请在做种或下载的过程中，遵守如下的规则，否则可能会受到管理组的严厉处罚甚至帐号被禁止。

&emsp;

#### :white_small_square: 上传与下载

1. 系统对所有下载行为都有分享率的要求，当前要求为 `%(announceConfig.downloadCheck.ratio).2f`， 所以在您发布后，尽可能延长做种的时间，尽可能多的赚取上传量与积分。
1. 系统对新注册 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天内的用户不做下载行为的分享率检查，所以新用户应该在此时间内尽可能的提高自已的分享率。
1. 不要在未出种的情况下停止做种，如有特殊情况，请在相关种子下留言说明。
1. 如果您下载的是 H&R 黑种，请仔细阅读 [黑种相关细则](/about/manual/hnrRules)，并及时处理黑种警告。
1. 每用户每种最多同时允许 `%(announceConfig.announceCheck.maxLeechNumberPerUserPerTorrent)d` 个下载，`%(announceConfig.announceCheck.maxSeedNumberPerUserPerTorrent)d` 个上传。
1. 系统可能会在某些时候开启做种资质检查，即不允许对非本站下载的种子进行保种，当前设置值为：
```javascript
  announce.seedingInFinishedCheck = %(announceConfig.seedingInFinishedCheck)s
```
1. 为减少红种的情况出现并确保数据被正确统计，请在退出客户端时先停止所有种子的上传或下载。

&emsp;

#### :white_small_square: 流量计算与积分统计

1. 种子发布者按 `%(salesGlobalConfig.uploader.value.Ur).2f` 倍的上传量计算。
1. 分流者按正常上传下载量计算。
1. 所有用户所有种子上传下载量享有促销加成，如遇全局促销则享有全局促销加成。
1. VIP 用户的上传下载量以及做种积分享有额外的加成，详情请参考 [VIP 用户权益细则](/about/manual/vipRules)。
1. 对做种人数较少（ < `%(scoreConfig.action.seedSeederAndLife.seederCount)d` 人）的种子保种可获得额外的积分加成。
1. 对发种时间越久的种子保种可获得更多的积分加成。
1. 对体积越大的种子种子保种可获得更高的上传量加成。
1. 更多积分统计细则请参考 [用户积分细则](/about/manual/scoreRules)。

&emsp;

#### :white_small_square: 订阅下载

1. %(appConfig.name)s 支持 RSS 订阅下载，在种子列表页，系统已经根据您的检索条件自动生成了 RSS 订阅地址，您 可以复制此地址并在客户端中直接使用。
1. 如您需要订阅多个类型的资源，您需要复制多个地址到您的客户端。
1. %(appConfig.name)s 支持 IRC 订阅下载，如果您的客户端支持 IRC 订阅，请根据如下配置自行设置：
```javascript
  ircAnnounce.server = %(ircAnnounceConfig.server)s
  ircAnnounce.port = %(ircAnnounceConfig.port)s
  ircAnnounce.channel = %(ircAnnounceConfig.channel)s
  ircAnnounce.anncounceNick = %(ircAnnounceConfig.nick)s
```

&emsp;

#### :white_small_square: 客户端限制

* %(appConfig.name)s 禁止一些特定的客户端软件访问，点此查看 [禁止客户端列表](/about/blank)。

&emsp;

#### :white_small_square: 恶意行为的界定与处罚

1. 使用不允许的客户端或使用不允许的访问方式进行上传或下载。
1. 使用第三方工具篡改上报数据。
1. 其它非正常行为上传或下载。

&emsp;

<span class="text-danger">** 注意：一旦您的行为被界定为恶意行为，您将可能受到非常严厉的处罚，具体请参阅 [禁令与处罚细则](/about/manual/forbidRules)**</span>