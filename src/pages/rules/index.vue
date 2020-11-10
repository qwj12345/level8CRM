<template>
  <div>
      <!--   -->
      <div>
          <img src="https://level8cases.oss-cn-hangzhou.aliyuncs.com/12345-173d510d-fa2e-483b-a0ba-c567147087e0.jpg" mode="widthFix"/>
      </div>

      <div>
        <van-tabs :active="active" swipeable color='#FFD636' @change="changeTab">
            <van-tab title="会员等级">
                <van-collapse :value="activeNames" :accordion="true" @change="changeCollapse">
                    <van-collapse-item title="新8会员" name="1">关注“地平线8号”公众号且授权登陆地平线8号会员中心小程序。</van-collapse-item>
                    <van-collapse-item title="银8会员" name="2">进入“地平线8号会员中心”小程序绑定一个或多个旅行箱。</van-collapse-item>
                    <van-collapse-item title="金8会员" name="3">“地平线8官方商城”交易满1000元。</van-collapse-item>
                    <van-collapse-item title="铂8会员" name="4">“地平线8官方商城”交易满3000元。</van-collapse-item>
                    <van-collapse-item title="钻8会员" name="5">“地平线8官方商城”交易满5000元。</van-collapse-item>
                    <van-collapse-item title="黑8会员" name="6">“地平线8官方商城”交易满10000元。</van-collapse-item>
                </van-collapse>
            </van-tab>
            <van-tab title="会员权益">
                <van-collapse :value="activeNames" :accordion="true" @change="changeCollapse">
                    <van-collapse-item title="新8会员" name="1">
                        <span class="title2">产品保修：</span>2年<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵10%；88会员节订单可抵20%；生日当天订单可抵12%<br/>
                        <span class="title2">包邮特权：</span>满99元包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=1出发币；会员日订单1元=2出发币<br/>
                        <span class="title2">无忧退货：</span>7天内无理由退货
                    </van-collapse-item>
                    <van-collapse-item title="银8会员" name="2">
                        <span class="title2">产品保修：</span>2年<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵10%；88会员节订单可抵20%；生日当天订单可抵12%<br/>
                        <span class="title2">包邮特权：</span>满99元包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=1.5出发币；会员日订单1元=3出发币<br/>
                        <span class="title2">无忧退货：</span>14天内无理由退货
                    </van-collapse-item>
                    <van-collapse-item title="金8会员" name="3">
                        <span class="title2">产品保修：</span>2年<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵12%；88会员节订单可抵20%；生日当天订单可抵14%<br/>
                        <span class="title2">包邮特权：</span>包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=1.8出发币；会员日订单1元=3.6出发币<br/>
                        <span class="title2">无忧退货：</span>30天内无理由退货<br/>
                        <span class="title2">产品定制：</span>行李箱有偿刻字
                    </van-collapse-item>
                    <van-collapse-item title="铂8会员" name="4">
                        <span class="title2">产品保修：</span>终身保修<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵14%；88会员节订单可抵20%；生日当天订单可抵16%<br/>
                        <span class="title2">包邮特权：</span>包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=2出发币；会员日订单1元=4出发币<br/>
                        <span class="title2">无忧退货：</span>30天内无理由退货<br/>
                        <span class="title2">产品定制：</span>行李箱有偿刻字<br/>
                        <span class="title2">微信服务：</span>建立铂8群/专享服务经理1对1
                    </van-collapse-item>
                    <van-collapse-item title="钻8会员" name="5">
                        <span class="title2">产品保修：</span>终身保修<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵16%；88会员节订单可抵20%；生日当天订单可抵18%<br/>
                        <span class="title2">包邮特权：</span>满99元包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=2.5出发币；会员日订单1元=5出发币<br/>
                        <span class="title2">无忧退货：</span>60天内无理由退货<br/>
                        <span class="title2">产品定制：</span>行李箱免费刻字<br/>
                        <span class="title2">微信服务：</span>建立钻8群/专享服务经理1对1
                    </van-collapse-item>
                    <van-collapse-item title="黑8会员" name="6">
                        <span class="title2">产品保修：</span>终身保修<br/>
                        <span class="title2">购物抵现：</span>日常订单可抵20%；88会员节订单可抵30%；生日当天订单可抵22%<br/>
                        <span class="title2">包邮特权：</span>满99元包邮<br/>
                        <span class="title2">订单换币：</span>日常订单1元=3出发币；会员日订单1元=6出发币<br/>
                        <span class="title2">无忧退货：</span>60天内无理由退货<br/>
                        <span class="title2">产品定制：</span>行李箱免费刻字<br/>
                        <span class="title2">微信服务：</span>建立黑8群/专享服务经理1对1
                    </van-collapse-item>
                </van-collapse>
            </van-tab>
            <van-tab title="会员降级">
                <van-collapse :value="activeNames" :accordion="true" @change="changeCollapse">
                    <van-collapse-item title="新8会员" name="1">升级后1年在“地平线8号会员中心”小程序的出发币无变化降为的普通用户</van-collapse-item>
                    <van-collapse-item title="银8会员" name="2">升级后1年未在“地平线8号官方商城”小程序交易降1级</van-collapse-item>
                    <van-collapse-item title="金8会员" name="3">升级后1年未在“地平线8号官方商城”小程序交易降1级</van-collapse-item>
                    <van-collapse-item title="铂8会员" name="4">升级后1年未在“地平线8号官方商城”小程序交易降1级</van-collapse-item>
                    <van-collapse-item title="钻8会员" name="5">升级后1年未在“地平线8号官方商城”小程序交易降1级</van-collapse-item>
                    <van-collapse-item title="黑8会员" name="6">升级后1年未在“地平线8号官方商城”小程序交易降1级</van-collapse-item>
                </van-collapse>
            </van-tab>
            <van-tab title="出发币说明">
                <van-collapse :value="activeNames" :accordion="true" @change="changeCollapse">
                    <van-collapse-item title="什么是出发币？" name="1">出发币属于会员私人财产，仅限会员本人使用，不可转赠。</van-collapse-item>
                    <van-collapse-item title="出发币有效时间？" name="2">出发币自获取之日起，365天内有效，过期出发币将自动清除。</van-collapse-item>
                    <van-collapse-item title="出发币如何赚取？" name="3">
                        1. 订单赚取出发币：不同等级会员订单换出发币倍数不同。<br/>
                        2. 互动赚取出发币：可参与会员中心的各项互动，如分享公众号精选图文，每日签到，抽奖，邀请好友注册，分享特定活动等。
                    </van-collapse-item>
                    <van-collapse-item title="出发币如何使用？" name="4">
                        1. 出发币抵现：购物可直接当现金抵扣，不同等级对应的抵扣阈值不同。<br/>
                        2. 出发币摇奖：消耗一定数额出发币即可报名摇奖活动每期摇奖奖品的报名门槛不同。<br/>
                        3. 出发币兑礼：每月	8号会员日可使用出发币兑换实物礼品及优惠券或折扣卡。<br/>
                        4.出发币换购：会员可通过消耗出发币，低价换购商城内正价货品。<br/>
                        5.出发币试用：会员可通过消耗一定出发币，报名新品免费试用活动。每期新品依据上市价格制定报名门槛。
                    </van-collapse-item>
                </van-collapse>
            </van-tab>
            <van-tab title="隐私条款">
                <div class="ys">
                    <div class="title bold">
                        注册使用条款、隐私政策及免责声明
                    </div>
                    <div class="bold font14">一、总则</div>
                    <div class="font13 marginTop10">
                        您注册成为「地平线8号」注册用户之前，应仔细阅读本服务协议。成都远行客科技有限公
                        司（以下简称“远行客”）作为「地平线8号」的经营者，根据本服务协议及/或随时对其
                        的修改向您提供服务。如您不同意本服务协议及/或随时对其的修改、及/或免责声明、及/
                        或隐私条款，您可以主动取消「地平线8号」提供的服务。您一旦使用「地平线8号」服务，
                        即视为您已了解并完全同意本服务协议各项内容、免责声明和隐私条款，包括远行客对服务
                        协议随时所做的任何修改，并成为「地平线8号」注册用户（以下简称“用户”）。
                    </div>
                    <div class="font13 marginTop10">
                        1.1用户应当同意本协议的条款并按照页面上的提示完成注册程序。用户在进行注册程序
                        过程中点击"同意"按钮即表示用户与远行客达成协议，完全接受本协议项下的全部条款。
                    </div>
                    <div class="font13 marginTop10">
                        1.2用户注册成功后，「地平线8号」将给予每个用户一个用户帐号（手机/微信账号）及
                相应的密码，该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有活动
                和事件负法律责任。
                    </div>
                    <div class="font13 marginTop10">
                        1.3用户可以使用「地平线8号」各个单项服务，当用户使用「地平线8号」各单项服务
                时，用户的使用行为视为其对该单项服务的服务条款以及「地平线8号」在该单项服务中发
                出的各类公告的同意。
                    </div>
                    <div class="font13 marginTop10">
                        1.4「地平线8号」会员服务协议以及各单项服务条款和公告可由远行客公司随时更新，且
                无需另行通知。您在使用相关服务时,应关注并遵守其所适用的相关条款。
                    </div>
                    <div class="bold font14 marginTop10">二、注册信息和隐私保护</div>
                    <div class="font13 marginTop10">
                        2.1「地平线8号」帐号（即「地平线8号」用户ID）的所有权归远行客，用户完成注册申
                请手续后，获得「地平线8号」帐号的使用权。用户应提供及时、详尽及准确的个人资料，
                并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将作为注册资料。
                如果因用户注册信息不真实而引起的问题及其产生的后果，「地平线8号」不负任何责任。
                    </div>
                    <div class="font13 marginTop10">
                        2.2用户不得将其帐号、密码转让或出借予他人使用。如用户发现其帐号遭他人非法使用，
                应立即通知「地平线8号」。因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用，
                「地平线8号」不承担任何责任。
                    </div>
                    <div class="font13 marginTop10">
                        2.3为了保障用户使用本服务的安全以及不断改进服务质量，本公司将记录并保存您登录
                和使用本服务的相关信息，但本公司承诺不将此类信息提供给任何第三方（除双方另有约定
                或法律法规另有规定及本公司关联公司外）。
                    </div>
                    <div class="font13 marginTop10">
                        2.4本公司会对用户的身份数据进行综合统计，仅出于提供销售和奖励等服务的需要使用。
                    </div>
                    <div class="font13 marginTop10">
                        2.5为更为有效地向用户提供服务，用户同意，本公司有权将用户注册及使用本服务过程
                中所提供、形成的信息提供给本公司关联公司或公司旗下的其他公司。同时，为更安全有效
                地向用户提供服务，根据法律法规的规定，或本公司需识别用户的身份，或本公司认为用户
                的账户存在风险时，本公司有权要求用户提交身份信息（包括但不限于身份证、户口本、护
                照等证件或其他文件）。除本协议另有规定外，本公司不对外公开或向第三方提供用户的信
                息，但以下情况除外：
                    </div>
                    <div class="font13 marginTop10">
                        (1)事先获得用户的明确授权；
                    </div>
                    <div class="font13 marginTop10">
                        (2)只有披露用户的个人资料，才能提供用户需要的产品和（或）服务；
                    </div>
                    <div class="font13 marginTop10">
                        (3)按照本协议的要求进行的披露；
                    </div>

                    <div class="font13 marginTop10">
                        (4)根据法律法规的规定；
                    </div>
                    <div class="font13 marginTop10">
                        (5)按照政府主管部门的要求；
                    </div>
                    <div class="font13 marginTop10">
                        (6)为维护本公司及其关联公司的合法权益；
                    </div>
                    <div class="font13 marginTop10">
                        2.6通过「地平线8号」出售给用户的旅行箱产品，若附有产品二维码，用户可扫描产品二
                        维码将自身ID与二维码相关联。通过这种方式，「地平线8号」可以有助于“失物寻回”：
                        若用户使用时不小心丢失旅行箱，可在「地平线8号」申请挂失，若拾到者扫描产品二维码
                        “上报拾到物”给「地平线8号」，「地平线8号」可将用户的联系方式推送给拾到者或将拾
                        到者的联系方式推送给用户，由用户直接和拾到者联系失物返还事宜。用户填写联系方式，
                        即视为已同意授权「地平线8号」为此目的使用和推送其联系方式。「地平线8号」对用户
                        丢失旅行箱及挂失后能否找回失物概不负责。
                    </div>
                    <div class="bold font14 marginTop10">三、使用规则</div>
                    <div class="font13 marginTop10">
                        3.1 用户在使用「地平线8号」服务时，必须遵守中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1 上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.1 反对宪法所确定的基本原则的；
                    </div>

                    <div class="font13 marginTop10">
                        3.1.1.2 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.3 损害国家荣誉和利益的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.4 煽动民族仇恨、民族歧视、破坏民族团结的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.5 破坏国家宗教政策，宣扬邪教和封建迷信的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.6 散布谣言，扰乱社会秩序，破坏社会稳定的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.7 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.8 侮辱或者诽谤他人，侵害他人合法权利的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.9 含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.1.10 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的。
                    </div>
                    <div class="font13 marginTop10">
                        3.1.2 不得为任何非法目的而使用网络服务系统；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3 不利用「地平线8号」服务从事以下活动：
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3.1 未经允许，进入计算机信息网络或者使用计算机信息网络资源的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3.2 未经允许，对计算机信息网络功能进行删除、修改或者增加的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3.3 未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3.4 故意制作、传播计算机病毒等破坏性程序的；
                    </div>
                    <div class="font13 marginTop10">
                        3.1.3.5 其他危害计算机信息网络安全的行为。
                    </div>
                    <div class="font13 marginTop10">
                        3.2 用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿「地平线8号」与合作公司、关联公司，并使之免受损害。对此，「地平线8号」有权视用户的行为性质，采取包括但不限于删除用户发布信息内容、暂停使用许可、终止服务、限制使用、回收「地平线8号」帐号、追究法律责任等措施。对恶意注册「地平线8号」帐号或利用「地平线8号」帐号进行违法活动、捣乱、骚扰、欺骗、其他用户以及其他违反本协议的行为，「地平线8号」有权回收其帐号。同时，「地平线8号」公司会视司法部门的要求，协助调查。
                    </div>
                    <div class="font13 marginTop10">
                        3.3 用户不得对本服务任何部分通过本服务任何部分或使用本服务获得的任何内容，进行复制、拷贝、出售、转售或用于任何其它商业目的。
                    </div>
                    <div class="font13 marginTop10">
                        3.4 用户须对自己在使用「地平线8号」服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在「地平线8号」公司首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予「地平线8号」公司等额的赔偿。
                    </div>

                    <div class="bold font14 marginTop10">四、服务内容</div>
                    <div class="font13 marginTop10">
                        4.1「地平线8号」网络服务的具体内容由「地平线8号」根据实际情况提供，「地平线8号」对其提供之服务拥有最终解释权。
                    </div>
                    <div class="font13 marginTop10">
                        4.2  除非本服务协议另有其它明确规定，「地平线8号」在用户注册后所推出的新产品、新功能、新服务，均受到本服务协议之规范。
                    </div>
                    <div class="font13 marginTop10">
                        4.3  为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备及负责与国际联网连线所需之一切必要装备，包括手机、计算机、数据机或其它存取装置。
                    </div>

                    <div class="font13 marginTop10">
                        4.4  鉴于网络服务的特殊性，「地平线8号」不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。
                    </div>
                    <div class="font13 marginTop10">
                        4.5「地平线8号」需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，如因此类情况而造成网络服务（包括收费网络服务）在合理时间内的中断，「地平线8号」无需为此承担任何责任。「地平线8号」保留不经事先通知为维修保养、升级或其它目的暂停全部或部分的网络服务的权利。
                    </div>
                    <div class="font13 marginTop10">
                        4.6  本服务或第三人可提供与其它国际互联网上之网站或资源之链接。由于「地平线8号」无法控制这些网站及资源，您了解并同意，此类网站或资源是否可供利用，「地平线8号」不予负责，存在或源于此类网站或资源之任何内容、广告、产品或其它资料，「地平线8号」亦不予保证或负责。因使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，「地平线8号」对其合法性不负责，亦不承担任何责任。
                    </div>
                    <div class="font13 marginTop10">
                        4.7  用户明确同意其使用「地平线8号」网络服务所存在的风险将完全由其自己承担。用户理解并接受下载或通过「地平线8号」服务而链接及得到的资讯、产品及服务均系「地平线8号」自动搜录，「地平线8号」对其合法性概不负责，亦不承担任何法律责任，用户自行承担风险，「地平线8号」不做任何形式的保证, 不保证搜索结果满足用户的要求，不保证搜索服务不中断，对搜索结果的安全性、正确性、及时性、合法性均不做担保。
                    </div>
                    <div class="font13 marginTop10">
                        4.8  12个月未登录的帐号，「地平线8号」保留关闭的权利。
                    </div>
                    <div class="font13 marginTop10">
                        4.9「地平线8号」有权于任何时间暂时或永久修改或终止本服务（或其任何部分），而无论其通知与否，「地平线8号」对用户和任何第三人均无需承担任何责任。
                    </div>
                    <div class="font13 marginTop10">
                        4.10  终止服务：您同意「地平线8号」得基于其自行之考虑，因任何理由，包含但不限于长时间未使用，或「地平线8号」认为您已经违反本服务协议的文字及精神，终止您的密码、帐号或本服务之使用（或服务之任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供之本服务，无需进行事先通知即可中断或终止，您承认并同意，「地平线8号」可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，及/或禁止继续使用前述文件或本服务。此外，您同意若本服务之使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，「地平线8号」对您或任何第三人均不承担任何责任。
                    </div>

                    <div class="bold font14 marginTop10">五、免责声明</div>
                    <div class="font13 marginTop10">
                        5.1「地平线8号」作为经注册的微信小程序，为您提供产品信息推送、定购及售后等服务。
                    </div>
                    <div class="font13 marginTop10">
                        5.2  任何通过「地平线8号」搜索而获取的信息均来自于远行客公司，「地平线8号」负责按"现状"和"可得到"的状态向您提供预定平台服务。但「地平线8号」对预定平台服务不作任何明示或暗示的保证，包括但不限于预定平台服务的适用性、没有错误或疏漏、持续性、准确性、可靠性。如您预订的产品中出现任何瑕疵，请您联系后台客服。「地平线8号」将尽力帮助您获取真实可靠的信息，同时也需要您及时反馈在使用中遇到的问题并对欺诈行为进行举报，以提高「地平线8号」的网络信息服务质量。
                    </div>
                    <div class="font13 marginTop10">
                        5.3「地平线8号」不担保其提供的服务一定能满足您的要求，也不担保其提供的网络服务不会中断，对其提供的网络服务的及时性、安全性也都不做担保。
                    </div>

                    <div class="font13 marginTop10">
                        5.4 「地平线8号」在获得您的额授权后，有权处理您因产品与公司交易产生的争议，并有权判断与该争议相关的事实及应适用的规则，进而作出处理决定。您理解并同意，「地平线8号」并非司法机构，仅能以普通人的身份对证据进行鉴别，「地平线8号」对争议的暂时处理完全是基于您的信任，「地平线8号」无法保证争议处理结果符合您的期望，也不对争议处理结论承担任何责任。
                    </div>
                    <div class="font13 marginTop10">
                        5.5 对于因不可抗力或「地平线8号」不能控制的原因造成的网络服务中断或其他缺陷，「地平线8号」不承担任何责任，但将尽力减少因此而给您造成的影响。
                    </div>
                    <div class="font13 marginTop10">
                        5.6 为方便您使用，「地平线8号」会根据收到的您反馈信息在相关链接下作出提示。
                    </div>
                    <div class="font13 marginTop10">
                        5.7  本声明适用中华人民共和国法律，您和「地平线8号」一致同意服从中华人民共和国人民法院管辖。如其中任何条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它条款依旧具有法律效力。我们保留随时更改上述免责及其他条款的权利。
                    </div>

                    <div class="bold font14 marginTop10">六、知识产权和其他合法权益（包括但不限于名誉权、商誉权）</div>
                    <div class="font13 marginTop10">
                        6.1「地平线8号」尊重他人知识产权和合法权益，呼吁用户也要同样尊重知识产权和他人合法权益。若您认为您的知识产权或其他合法权益被侵犯，请按照以下说明向「地平线8号」提供资料∶ 请注意：如果权利通知的陈述失实，权利通知提交者将承担对由此造成的全部法律责任（包括但不限于赔偿各种费用及律师费）。如果上述个人或单位不确定网络上可获取的资料是否侵犯了其知识产权和其他合法权益，「地平线8号」建议该个人或单位首先咨询专业人士。
                    </div>
                    <div class="font13 marginTop10">
                        为了「地平线8号」有效处理上述个人或单位的权利通知，请使用以下格式（包括各条款的序号）：
                    </div>
                    <div class="font13 marginTop10">
                        (1)权利人对涉嫌侵权内容拥有知识产权或其他合法权益和/或依法可以行使知识产权或其他合法权益的权属证明；
                    </div>
                    <div class="font13 marginTop10">
                        (2)请充分、明确地描述被侵犯了知识产权或其他合法权益的情况；
                    </div>

                    <div class="font13 marginTop10">
                        (3)请指明涉嫌侵权的哪些内容侵犯了第2项中列明的权利；
                    </div>
                    <div class="font13 marginTop10">
                        (4)请提供权利人具体的联络信息，包括姓名、身份证或护照复印件（对自然人）、单位登记证明复印件（对单位）、通信地址、电话号码、传真和电子邮件；
                    </div>
                    <div class="font13 marginTop10">
                        (5)请提供涉嫌侵权内容在信息网络上的位置（如指明您举报的含有侵权内容的出处，即：指「地平线8号」内的位置）以便我们与您举报的含有侵权内容的所有权人/管理人联系；
                    </div>
                    <div class="font13 marginTop10">
                        (6)请在权利通知中加入如下关于通知内容真实性的声明： “我保证，本通知中所述信息是充分、真实、准确的，如果本权利通知内容不完全属实，本人将承担由此产生的一切法律责任。”一旦收到符合上述要求之通知，「地平线8号」将采取包括删除等相应措施。如不符合上述条件，「地平线8号」会请阁下提供相应信息，且暂不采取包括删除等相应措施。
                    </div>
                    <div class="font13 marginTop10">
                    6.2  对于用户通过「地平线8号」服务上传到「地平线8号」网站上可公开获取区域的任何内容，用户授予「地平线8号」在全世界范围内具有免费的、永久性的、不可撤销的、非独家的的许可以及再许可的权利，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。
                    </div>
                    <div class="font13 marginTop10">
                        6.3「地平线8号」拥有本网站内所有资料的版权。任何被授权的浏览、复制、打印和传播属于本网站内的资料必须符合以下条件：
                    </div>
                    <div class="font13 marginTop10">
                    所有的资料和图象均以获得信息为目的；
                    </div>
                    <div class="font13 marginTop10">
                    所有的资料和图象均不得用于商业目的；
                    </div>
                    <div class="font13 marginTop10">
                    所有的资料、图象及其任何部分都必须包括此版权声明；
                    </div>
                    <div class="font13 marginTop10">
                    「地平线8号」所有的产品、技术与所有程序均属于「地平线8号」及所属公司的知识产权，在此并未授权。
                    </div>
                    <div class="font13 marginTop10">
                    「地平线8号」及相关图形等为「地平线8号」的商标
                    </div>
                </div>
            </van-tab>
            
        </van-tabs>
      </div>

  </div>
</template>

<script>
export default {
    data() {
        return {
            active:'0',
            activeNames: '1'
        }
    },
    methods: {
        changeCollapse(e){
            this.activeNames = e.target[0];
        },
        changeTab(){
            this.activeNames = '1';
        }
    },
}
</script>

<style>
.title2{
    font-weight: bold;
}
.page{
    padding: 10px;
}
.title{
    padding: 10px 0 10px 0;
    text-align: center;
}
.bold{
    font-weight: bold;
}
.font13{
    font-size: 12px;
}
.font14{
    font-size: 13px;
}
.marginTop10{
    margin-top: 10px;
}
.ys{
    padding: 4px 14px;
    color: #999;
}
</style>