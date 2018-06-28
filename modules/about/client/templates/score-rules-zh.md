### :orange_book: 用户积分细则 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一个 <mark>用户积分</mark> 系统，用户有很多种获取积分的办法，而且积分也有非常大的用处。用户积分也是计算用户等级的基础，不同的用户等级对应不同的访问权限，[这里可以查看有关用户等级的细则详情](/about/manual/userLevelRules)。

&emsp;

#### :white_small_square: 积分增加规则
* 每日签到获得 `%(scoreConfig.action.dailyCheckIn.dailyBasicScore)d` 积分，连续签到，每天额外增加 `%(scoreConfig.action.dailyCheckIn.dailyStepScore)d` 累计积分，`%(scoreConfig.action.dailyCheckIn.dailyMaxScore)d` 积分封顶。
* 每发布一条种子资源可获得 `%(scoreConfig.action.uploadTorrent.value)d` 积分。
* 发布的种子资源被管理员设置为推荐可获得 `%(scoreConfig.action.uploadTorrentBeRecommend.value)d` 积分。
* 每上传一条资源字幕可获得 `%(scoreConfig.action.uploadSubtitle.value)d` 积分。
* 上传的资源每收到一个点赞可获得 `%(scoreConfig.action.thumbsUpScoreOfTorrentTo.value)d` 积分。
* 论坛发布的主题或回复每收到一个点赞可获得 `%(scoreConfig.action.thumbsUpScoreOfTopicTo.value)d` 积分。
* 响应用户的求种请求且被请求者接受时，可获得请求者发布的悬赏积分。
* 当客户端软件报告上传或下载量时，会获得相应的积分，<mark>种子体积越大积分加成越多，种子体积小于 %(scoreConfig.action.seedUpDownload.additionSize_str)s 不享受体积加成</mark>。
  <span class="text-danger">**注意: 系统根据实际的上传下载量计算积分。**</span>
```javascript
  种子体积加成系数: sqrt(torrent_size / %(scoreConfig.action.seedUpDownload.additionSize_str)s)。
  每 %(scoreConfig.action.seedUpDownload.perlSize_str)s 上传量: %(scoreConfig.action.seedUpDownload.uploadValue).2f 积分。
  每 %(scoreConfig.action.seedUpDownload.perlSize_str)s 下载量: %(scoreConfig.action.seedUpDownload.downloadValue).2f 积分。
  Vip 用户额外加成系数: %(scoreConfig.action.seedUpDownload.vipRatio).2f 倍。

  举例: 
    种子体积 40G, 则体积加成系数为 2, 假设本次上报上传量为 20G 下载量为 10G, 则：
    非 Vip 用户获得上传积分: 2 * 1 * 4 = 8, 下载积分: 2 * 0.5 * 2 = 2。
    Vip 用户获得上传积分: 8 * 1.5 = 12, 下载积分: 2 * 1.5 = 3。
```
* 种子发布者按 `%(scoreConfig.action.seedUpDownload.uploaderRatio).2f` 倍计算上传量积分。
* 在做种状态下，将会获得由保种时间带来的保种积分, 每个种子每 `%(scoreConfig.action.seedTimed.additionTime_str)s` 获得 `%(scoreConfig.action.seedTimed.timedValue).2f` 积分，Vip 用户额外加成系数为 `%(scoreConfig.action.seedTimed.vipRatio).2f`。
* 对于上述两项获得的积分, 还会根据种子的生命期和保种人数获得额外的再次加成，<mark>而且两种加成叠加生效</mark>。
```javascript
  保种人数加成:
  ===========
  加成系数: %(scoreConfig.action.seedSeederAndLife.seederCoefficient).2f
  最多保种人数: %(scoreConfig.action.seedSeederAndLife.seederCount)d
  
  如果只有 1 个保种用户: 加成系数为 3, [2 用户为 1.9], [3 用户为 1.8], [4 用户为 1.7], [5 用户为 1.6], [6 用户为 1.5], [7 用户为 1.4], [8 用户为 1.3], [9 用户为 1.2], [10 用户为 1.1], [超过 10 用户为 1, 相当于没有加成]。
```
```javascript
  种子生命加成:
  ===========
  加成系数: %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f
  最大加成系数: %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f
  
  加成基础系数为 %(scoreConfig.action.seedSeederAndLife.lifeBasicRatio).2f, 根据种子生命每天增加 %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f。
  如果种子生命(发布时间)为 10 天，则加成系数为 1.01, [100 天是 1.1], [200 天是 1.2], 以此类推，最大加成系数为 %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f。
```

&emsp;

#### :white_small_square: 积分扣除规则
* 重新激活长时间未使用的用户帐户，帐户状态由 <mark>空闲</mark> 变为 <mark>正常</mark>, 扣除 `%(signConfig.idle.activeIdleAccountBasicScore)d` 基础积分，另外每多空闲一天需多扣除 `%(signConfig.idle.activeMoreScorePerDay).2f` 积分，同时每一级需多扣除 `%(signConfig.idle.activeMoreScorePerLevel).2f` 积分。
* 兑换一张邀请函，需要扣除 `%(inviteConfig.scoreExchange)d` 积分。
* 用户每发布一条请求，系统会自动回收 `%(requestsConfig.scoreForAddRequest)d` 积分，如果请求被回应而且被请求者采纳，系统会自动扣除请求者悬赏的积分。
* 移除一条 H&R 警告，需要扣除 `%(hnrConfig.scoreToRemoveWarning)d` 积分。
* 发布的种子资源被删除，需要 `%(scoreConfig.action.uploadTorrentBeDeleted.value)d` 积分。
* 发布的资源字幕被删除，需要 `%(scoreConfig.action.uploadSubtitleBeDeleted.value)d` 积分。
* 为种子资源点赞，需要 `%(scoreConfig.action.thumbsUpScoreOfTorrentFrom.value)d` 积分。
* 为论坛主题或回复点赞，需要 `%(scoreConfig.action.thumbsUpScoreOfTopicFrom.value)d` 积分。