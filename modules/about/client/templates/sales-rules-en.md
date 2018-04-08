### :orange_book: Torrent Sales Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** provide a variety of torrents sales, administrators can set a different level of sale for each seed, the site may also launch a special promotional event at a special time, please pay attention to the news within the station.

&emsp;

#### :white_small_square: Sale tags 
&emsp;&emsp; On the torrents list or details page, the torrent will have a <mark>green</mark> sale tag, which may be one of the following:


Tag | Desc | Tag | Desc
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

#### :white_small_square: Sale details
1. The length of each seed sale time is automatically determined by the seed size. The current system setting is: per `%(salesTypeConfig.expires.size_str)s` sale `%(salesTypeConfig.expires.time_str)s` hours, after the sale expires, the sale tag is automatically disappear.
1. The site may also launch a special global sale at a special time. The event notification will be highlighted above the site's home page before the event begins.
1. When the torrent is set as a sale by the administrator, the system sends a message notification to the torrent uploader.

&emsp;

&emsp;&emsp;<span class="text-danger">**Note: Sale only affect your upload and download data. The system calculates your points based on actual uploads and downloads.**</span>