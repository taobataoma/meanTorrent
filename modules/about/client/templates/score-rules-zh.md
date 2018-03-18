### :orange_book: 用户积分细则详细说明 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一个 <mark>用户积分</mark> 系统，用户有很多种获取积分的办法，而且积分也有非常大的用处。用户积分也是计算用户等级的基础，不同的用户等级对应不同的访问权限，[这里可以查看有关用户等级的细则详情](/about/manual/userLevelRules)。

&emsp;

#### :white_small_square: 积分增加规则
* 每日签到获得 `%(scoreConfig.action.checkInEveryDay.value)d` 积分，连续登记，每天额外增加 `%(scoreConfig.action.checkInConsDay.value)d` 累计积分。
* 每发布一条种子资源可获得 `%(scoreConfig.action.uploadTorrent.value)d` 积分。
* 发布的种子资源被管理员设置为推荐可获得 `%(scoreConfig.action.uploadTorrentBeRecommend.value)d` 积分。
* 每上传一条资源字幕可获得 `%(scoreConfig.action.uploadSubtitle.value)d` 积分。
* 上传的资源每收到一个点赞可获得 `%(scoreConfig.action.thumbsUpScoreOfTorrentTo.value)d` 积分。
* 论坛发布的主题或回复每收到一个点赞可获得 `%(scoreConfig.action.thumbsUpScoreOfTopicTo.value)d` 积分。
* 响应用户的求种请求且被请求者接受时，可获得请求者发布的悬赏积分。
&emsp;

#### :white_small_square: 积分扣除规则
* 重新激活长时间未使用的用户帐户，帐户状态由 <mark>非激活</mark> 变为 <mark>正常</mark>, 扣除 `%(signConfig.activeIdleAccountScore)d` 积分。
* 兑换一张邀请函，需要扣除 `%(inviteConfig.scoreExchange)d` 积分。
* 用户每发布一条请求，系统会自动回收 `%(requestsConfig.scoreForAddRequest)d` 积分，如果请求被回应而且被请求者采纳，系统会自动扣除请求者悬赏的积分。
* 移除一条 H&R 警告，需要扣除 `%(hnrConfig.scoreToRemoveWarning)d` 积分。
* 发布的种子资源被删除，需要 `%(scoreConfig.action.uploadTorrentBeDeleted.value)d` 积分。
* 发布的资源字幕被删除，需要 `%(scoreConfig.action.uploadSubtitleBeDeleted.value)d` 积分。
* 为种子资源点赞，需要 `%(scoreConfig.action.thumbsUpScoreOfTorrentFrom.value)d` 积分。
* 为论坛主题或回复点赞，需要 `%(scoreConfig.action.thumbsUpScoreOfTopicFrom.value)d` 积分。

&emsp;
#### :white_small_square: 禁止的行为

&emsp;

#### :white_small_square: 违规处罚