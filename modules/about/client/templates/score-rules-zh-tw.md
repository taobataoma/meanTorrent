### :orange_book: 用戶積分細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一個 <mark>用戶積分</mark> 系統，用戶有很多種獲取積分的方法，而且積分也有非常大的用處。使用者積分也是計算用戶等級的基礎，不同的用戶等級對應不同的訪問許可權，[這裡可以檢視有關用戶等級的細則詳情](/about/manual/userLevelRules)。

&emsp;

#### :white_small_square: 積分增加規則
* 每日簽到獲得 `%(scoreConfig.action.dailyCheckIn.dailyBasicScore)d` 積分，連續簽到，每天額外增加 `%(scoreConfig.action.dailyCheckIn.dailyStepScore)d` 累計積分，`%(scoreConfig.action.dailyCheckIn.dailyMaxScore)d` 積分封頂。
* 每釋出一條種子資源可獲得 `%(scoreConfig.action.uploadTorrent.value)d` 積分。
* 釋出的種子資源被管理員設定為推薦可獲得 `%(scoreConfig.action.uploadTorrentBeRecommend.value)d` 積分。
* 每上傳一條資源字幕可獲得 `%(scoreConfig.action.uploadSubtitle.value)d` 積分。
* 上傳的資源每收到一個點贊可獲得 `%(scoreConfig.action.thumbsUpScoreOfTorrentTo.value)d` 積分。
* 論壇釋出的主題或回覆每收到一個點贊可獲得 `%(scoreConfig.action.thumbsUpScoreOfTopicTo.value)d` 積分。
* 響應用戶的求種請求且被請求者接受時，可獲得請求者釋出的懸賞積分。
* 當客戶端軟體報告上傳或下載量時，會獲得相應的積分，<mark>種子體積越大積分加成越多，種子體積小於 %(scoreConfig.action.seedUpDownload.additionSize_str)s 不享受體積加成</mark>。
  <span class="text-danger">**注意: 系統根據實際的上傳下載量計算積分。**</span>
```javascript
  種子體積加成係數: sqrt(torrent_size / %(scoreConfig.action.seedUpDownload.additionSize_str)s)。
  每 %(scoreConfig.action.seedUpDownload.perlSize_str)s 上傳量: %(scoreConfig.action.seedUpDownload.uploadValue)d 積分。
  每 %(scoreConfig.action.seedUpDownload.perlSize_str)s 下載量: %(scoreConfig.action.seedUpDownload.downloadValue)d 積分。
  Vip 用戶額外加成係數: %(scoreConfig.action.seedUpDownload.vipRatio).2f 倍。

  舉例: 
    種子體積 40G, 則體積加成係數為 2, 假設本次上報上傳量為 10G 下載量為 15G, 則：
    非 Vip 用戶獲得上傳積分: 2 * 2 * 10 = 40, 下載積分: 2 * 1 * 15 = 30。
    Vip 用戶獲得上傳積分: 40 * 1.5 = 60, 下載積分: 30 * 1.5 = 45。
```
* 在做種狀態下，將會獲得由保種時間帶來的保種積分, 每個種子每 `%(scoreConfig.action.seedTimed.additionTime_str)s` 獲得 `%(scoreConfig.action.seedTimed.timedValue)d` 積分，Vip 用戶額外加成係數為 `%(scoreConfig.action.seedTimed.vipRatio).2f`。
* 對於上述兩項獲得的積分, 還會根據種子的生命期和保種人數獲得額外的再次加成，<mark>而且兩種加成疊加生效</mark>。
```javascript
  保種人數加成:
  ===========
  加成係數: %(scoreConfig.action.seedSeederAndLife.seederCoefficient).2f
  最多保種人數: %(scoreConfig.action.seedSeederAndLife.seederCount)d
  
  如果只有 1 個保種用戶: 加成係數為 6, [2 用戶為 5.5], [3 用戶為 5], [4 用戶為 4.5], [5 用戶為 4], [6 用戶為 3.5], [7 用戶為 3], [8 用戶為 2.5], [9 用戶為 2], [10 用戶為 1.5], [超過 10 用戶為 1, 相當於沒有加成]。
```
```javascript
  種子生命加成:
  ===========
  加成係數: %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f
  最大加成係數: %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f
  
  加成基礎係數為 1, 根據種子生命每天增加 %(scoreConfig.action.seedSeederAndLife.lifeCoefficientOfDay).3f。
  如果種子生命(釋出時間)為 10 天，則加成係數為 1.05, [100 天是 1.5], [200 天是 2.0], 以此類推，最大加成係數為 %(scoreConfig.action.seedSeederAndLife.lifeMaxRatio).2f。
```
&emsp;

#### :white_small_square: 積分扣除規則
* 重新啟用長時間並未使用的用戶帳戶，帳戶狀態由 <mark>空閒</mark> 變為 <mark>正常</mark>, 扣除 `%(signConfig.idle.activeIdleAccountBasicScore)d` 基礎積分，另外每多空閒一天需多扣除 `%(signConfig.idle.activeMoreScorePerDay).2f` 積分，同時每一級需多扣除 `%(signConfig.idle.activeMoreScorePerLevel).2f` 積分。
* 兌換一張邀請函，需要扣除 `%(inviteConfig.scoreExchange)d` 積分。
* 使用者每釋出一條請求，系統會自動回收 `%(requestsConfig.scoreForAddRequest)d` 積分，如果請求被迴應而且被請求者採納，系統會自動扣除請求者懸賞的積分。
* 移除一條 H&R 警告，需要扣除 `%(hnrConfig.scoreToRemoveWarning)d` 積分。
* 釋出的種子資源被刪除，需要 `%(scoreConfig.action.uploadTorrentBeDeleted.value)d` 積分。
* 釋出的資源字幕被刪除，需要 `%(scoreConfig.action.uploadSubtitleBeDeleted.value)d` 積分。
* 為種子資源點贊，需要 `%(scoreConfig.action.thumbsUpScoreOfTorrentFrom.value)d` 積分。
* 為論壇主題或回覆點贊，需要 `%(scoreConfig.action.thumbsUpScoreOfTopicFrom.value)d` 積分。
