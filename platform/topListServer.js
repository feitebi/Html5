const express = require("express");
const app = express();
const https = require('https'); //针对于changenow 接口
const request = require('request');

//爬网页 通过http.request 
// gbk 模块可以完整的在cmd里打印全部页面标签信息
// jsdom模块使用方法
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
const http = require('http');
const fs = require('fs');
const url = require('url');
const gbk =require('iconv-lite');
const JSDOM = require('jsdom').JSDOM; //调用该模块对象的JSDOM方法
app.use(express.static(__dirname));
//所有的代币简写名 和小写全名
var tokenNameListArr = [{"name":"XRP","fullName":"Ripple","indexPrice":"0.0000007","www":"https://ripple.com/"},{"name":"BKX","fullName":"Bankex","indexPrice":"10.16","www":"https://bankex.com"},{"name":"RCT","fullName":"RealChain","indexPrice":"0.67","www":"http://rcfund.org/"},{"name":"ZIP","fullName":"Zipper","indexPrice":"0.023","www":"http://zipper.io"},{"name":"AUTO","fullName":"CUBE","indexPrice":"0.08","www":"https://cubeint.io/"},{"name":"LET","fullName":"LinkEye","indexPrice":"0.45","www":"https://linkeye.com/"},{"name":"NCASH","fullName":"Nucleus Vision","indexPrice":"0.066","www":"https://nucleus.vision/"},{"name":"KEY","fullName":"Selfkey","indexPrice":"0.0825","www":"https://selfkey.org/"},{"name":"MEET","fullName":"CoinMeet","indexPrice":"0.56","www":"https://coinmeet.io/"},{"name":"PRA","fullName":"ProChain","indexPrice":"2.5","www":"https://chain.pro/"},{"name":"RFR","fullName":"Refereum","indexPrice":"0.127","www":"https://refereum.com/"},{"name":"REF","fullName":"RefToken","indexPrice":"95.7","www":"https://reftoken.io/"},{"name":"SSC","fullName":"SelfSell","indexPrice":"0.66","www":"https://www.selfsell.com/"},{"name":"BCC","fullName":"BitConnect","indexPrice":"4.3","www":"https://bitconnectcoin.co/"},{"name":"LIGHT","fullName":"Lightcoin","indexPrice":"0.0039","www":"http://www.lightchain.one/"},{"name":"OC","fullName":"OceanChain","indexPrice":"0.11","www":"https://oceanchain.club/"},{"name":"INS","fullName":"INS Ecosystem","indexPrice":"16.96","www":"https://ins.world/"},{"name":"RCN","fullName":"Ripio Credit Network","indexPrice":"0.5","www":"https://ripiocredit.network/"},{"name":"RVT","fullName":"Rivetz","indexPrice":"1.84","www":"https://rivetzintl.com/"},{"name":"MYB","fullName":"MyBit Token","indexPrice":"11.09","www":"https://mybit.io/"},{"name":"CSNO","fullName":"BitDice","indexPrice":"0.9858","www":"https://www.bitdice.me/"},{"name":"TKS","fullName":"Tokes","indexPrice":"0.5828","www":"https://tokesplatform.org/"},{"name":"PING","fullName":"CryptoPing","indexPrice":"1.9","www":"https://cryptoping.tech/"},{"name":"LEV","fullName":"Leverj","indexPrice":"0.858","www":"https://leverj.io/"},{"name":"TFL","fullName":"True Flip","indexPrice":"6.15","www":"https://trueflip.io/"},{"name":"ETT","fullName":"EncryptoTel","indexPrice":"0.4306","www":"https://encryptotel.com/"},{"name":"ETH","fullName":"Ethereum","indexPrice":"1.89","www":"https://www.ethereum.org/"},{"name":"EOS","fullName":"EOS","indexPrice":"7","www":"https://eos.io/"},{"name":"ADA","fullName":"Cardano","indexPrice":"0.0163","www":"https://www.cardanohub.org/"},{"name":"NEO","fullName":"NEO","indexPrice":"1","www":"https://neo.org/"},{"name":"TRX","fullName":"Tron","indexPrice":"0.01","www":"https://tron.network/"},{"name":"VEN","fullName":"VeChain","indexPrice":"0.5","www":"https://www.vechain.org/"},{"name":"OMG","fullName":"OmiseGo","indexPrice":"1.86","www":"https://omisego.network/"},{"name":"QTUM","fullName":"Qtum","indexPrice":"2.02","www":"https://qtum.org/"},{"name":"ICX","fullName":"ICON","indexPrice":"1.43","www":"https://icon.foundation/"},{"name":"LSK","fullName":"Lisk","indexPrice":"0.4839","www":"https://lisk.io/"},{"name":"BTM","fullName":"Bytom","indexPrice":"0.25","www":"https://bytom.io/"},{"name":"PPT","fullName":"Populous","indexPrice":"1.69","www":"http://populous.co/"},{"name":"BTS","fullName":"BitShares","indexPrice":"0.0636","www":"https://bitshares.org/"},{"name":"ZIL","fullName":"Zilliqa","indexPrice":"0.0535","www":"https://www.zilliqa.com/"},{"name":"ZRX","fullName":"0x","indexPrice":"0.33","www":"https://0xproject.com/"},{"name":"AE","fullName":"Aeternity","indexPrice":"1.88","www":"https://www.aeternity.com/"},{"name":"STRAT","fullName":"Stratis","indexPrice":"0.0468","www":"http://stratisplatform.com/"},{"name":"WAVES","fullName":"Waves","indexPrice":"1.28","www":"https://wavesplatform.com/"},{"name":"DGD","fullName":"DigixDAO","indexPrice":"20.92","www":"https://digix.io/"},{"name":"SNT","fullName":"Status","indexPrice":"0.2496","www":"https://status.im/"},{"name":"AION","fullName":"Aion","indexPrice":"5.78","www":"https://aion.network/"},{"name":"REP","fullName":"Augur","indexPrice":"3.68","www":"http://www.augur.net/"},{"name":"LRC","fullName":"Loopring","indexPrice":"0.35","www":"https://loopring.org/"},{"name":"GNT","fullName":"Golem","indexPrice":"0.0714","www":"https://golem.network/"},{"name":"BAT","fullName":"Basic Attention Token","indexPrice":"0.2451","www":"https://basicattentiontoken.org/"},{"name":"KMD","fullName":"Komodo","indexPrice":"0.1533","www":"https://komodoplatform.com/"},{"name":"KNC","fullName":"Kyber Network","indexPrice":"3.3","www":"https://kyber.network/"},{"name":"ARK","fullName":"Ark","indexPrice":"0.0735","www":"http://ark.io/"},{"name":"SUB","fullName":"Substratum","indexPrice":"0.1257","www":"https://substratum.net/"},{"name":"DRGN","fullName":"Dragonchain","indexPrice":"0.249","www":"https://dragonchain.com/"},{"name":"QASH","fullName":"QASH","indexPrice":"1.6","www":"https://liquid.plus/"},{"name":"STORM","fullName":"Storm","indexPrice":"0.066","www":"https://stormtoken.com/"},{"name":"NPXS","fullName":"Pundi X","indexPrice":"0.0129","www":"https://pundix.com/"},{"name":"VERI","fullName":"Veritaseum","indexPrice":"41.95","www":"http://veritas.veritaseum.com/"},{"name":"BNT","fullName":"Bancor","indexPrice":"26.22","www":"https://www.bancor.network/"},{"name":"FUN","fullName":"FunFair","indexPrice":"0.0484","www":"https://www.funfair.io/"},{"name":"GXS","fullName":"GXChain","indexPrice":"0.8","www":"https://gxs.gxb.io/"},{"name":"ELA","fullName":"Elastos","indexPrice":"100","www":"https://www.elastos.org/"},{"name":"NXT","fullName":"Nxt","indexPrice":"0.00003655","www":"https://nxt.org/"},{"name":"POWR","fullName":"Power Ledger","indexPrice":"0.6314","www":"https://powerledger.io/"},{"name":"GTO","fullName":"Gifto","indexPrice":"0.67","www":"https://gifto.io/"},{"name":"MCO","fullName":"Monaco","indexPrice":"17.96","www":"http://www.mona.co/"},{"name":"R","fullName":"Revain","indexPrice":"0.33","www":"https://revain.org/"},{"name":"LINK","fullName":"ChainLink","indexPrice":"0.6007","www":"https://smartcontract.com/"},{"name":"MAID","fullName":"MaidSafeCoin","indexPrice":"0.0883","www":"http://maidsafe.net/"},{"name":"NEBL","fullName":"Neblio","indexPrice":"0.6374","www":"https://nebl.io/"},{"name":"STORJ","fullName":"Storj","indexPrice":"2.81","www":"https://storj.io/"},{"name":"REQ","fullName":"Request Network","indexPrice":"0.4356","www":"https://request.network/"},{"name":"PART","fullName":"Particl","indexPrice":"3.3","www":"https://particl.io/"},{"name":"UET","fullName":"Useless Ethereum Token","indexPrice":"0.1201","www":"https://uetoken.com/"},{"name":"SJCX","fullName":"Storjcoin X","indexPrice":"0.0284","www":"http://storj.io/"},{"name":"UNITY","fullName":"SuperNET","indexPrice":"25.81","www":"https://komodoplatform.com/"},{"name":"THETA","fullName":"Theta","indexPrice":"0.9759","www":"https://www.thetatoken.org/"},{"name":"WPR","fullName":"WePower Network","indexPrice":"0.7858","www":"http://wepower.network/"},{"name":"ADL","fullName":"Adelphoi","indexPrice":"0.2154","www":"https://www.adelphoi.io/"},{"name":"AT","fullName":"AWARE Token","indexPrice":"0.2","www":"https://at.top/"},{"name":"CAN","fullName":"Content and AD Nework","indexPrice":"0.25","www":"http://mobipromo.io/cn/"},{"name":"OTX","fullName":"Octanox","indexPrice":"0.6422","www":"https://octanox.org/"},{"name":"ICN","fullName":"iCoin","indexPrice":"0.8381","www":"http://www.icoin.world/"},{"name":"MNM","fullName":"Mineum","indexPrice":"0.1141","www":"https://mineum.org/"},{"name":"ICOB","fullName":"ICOBID","indexPrice":"0.001304","www":"http://icobidplatform.net/"},{"name":"DTB","fullName":"Databits","indexPrice":"0.4612","www":"http://www.augmentorsgame.com/"},{"name":"XRL","fullName":"Rialto","indexPrice":"0.9065","www":"https://www.rialto.ai/"},{"name":"DRT","fullName":"DomRaider","indexPrice":"0.9557","www":"https://www.domraider.io/en/"},{"name":"QAU","fullName":"Quantum","indexPrice":"0.3455","www":"http://www.quantumproject.org/"},{"name":"NXC","fullName":"Nexium","indexPrice":"0.0689","www":"https://beyond-the-void.net/"},{"name":"XSPEC","fullName":"Spectrecoin","indexPrice":"0.005463","www":"https://spectreproject.io/"},{"name":"PLU","fullName":"Pluton","indexPrice":"8.02","www":"https://plutus.it/"},{"name":"GOLOS","fullName":"Golos","indexPrice":"0.1235","www":"https://golos.io/"},{"name":"PST","fullName":"Primas","indexPrice":"1.43","www":"https://primas.io/"},{"name":"AVT","fullName":"Aventus","indexPrice":"21.96","www":"https://aventus.io/"},{"name":"COFI","fullName":"CoinFi","indexPrice":"0.66","www":"https://www.coinfi.com/"},{"name":"MYST","fullName":"Mysterium","indexPrice":"5.26","www":"https://mysterium.network/"},{"name":"CVCOIN","fullName":"CVCoin","indexPrice":"2.59","www":"https://crypviser.net/"},{"name":"TIME","fullName":"Chronobank","indexPrice":"59.35","www":"https://chronobank.io/"},{"name":"ATL","fullName":"ATLANT","indexPrice":"4.29","www":"https://atlant.io/"},{"name":"CTR","fullName":"Centra","indexPrice":"11.21","www":"https://www.centra.tech/"},{"name":"RIYA","fullName":"Etheriya","indexPrice":"1.26","www":"http://www.etheriya.net/"},{"name":"MBI","fullName":"Monster Byte","indexPrice":"0.6841","www":"https://monsterbyte.io/"},{"name":"DAR","fullName":"Darcrus","indexPrice":"0.1705","www":"https://darcr.us/"},{"name":"FYN","fullName":"FundYourselfNow","indexPrice":"1.03","www":"https://www.fundyourselfnow.com/"},{"name":"SKIN","fullName":"SkinCoin","indexPrice":"0.2512","www":"https://skincoin.org/"},{"name":"LATX","fullName":"LatiumX","indexPrice":"0.6611","www":"https://latium.org/"},{"name":"MCAP","fullName":"MCAP","indexPrice":"27.3","www":"http://mcaplabs.com/"},{"name":"LGD","fullName":"Legends Room","indexPrice":"6.89","www":"http://legendsroomlv.com/"},{"name":"AHT","fullName":"Bowhead","indexPrice":"0.0401","www":"https://bowheadhealth.com/"},{"name":"RNT","fullName":"Oneroot","indexPrice":"0.6","www":"https://www.oneroot.io/en"},{"name":"PSB","fullName":"Pesobit","indexPrice":"0.007428","www":"http://www.pesobit.net/"},{"name":"DDD","fullName":"Scry","indexPrice":"1","www":"https://home.scry.info/"},{"name":"TIX","fullName":"Blocktix","indexPrice":"1.18","www":"https://blocktix.io/"},{"name":"SNC","fullName":"SunContract","indexPrice":"0.106","www":"https://suncontract.org/"},{"name":"IPC","fullName":"IPChain","indexPrice":"2","www":"http://www.ipcchain.org/"},{"name":"TSL","fullName":"Energo","indexPrice":"0.175","www":"https://www.energolabs.com/#/"},{"name":"ARN","fullName":"Aeron","indexPrice":"3","www":"https://aeron.aero/"},{"name":"PPY","fullName":"Peerplays","indexPrice":"32.44","www":"http://www.peerplays.com/"},{"name":"MSP","fullName":"Mothership","indexPrice":"0.246","www":"https://mothership.cx/"},{"name":"OMNI","fullName":"Omni","indexPrice":"8.9","www":"http://www.omnilayer.org/"},{"name":"LKK","fullName":"Lykke","indexPrice":"0.33","www":"https://lykke.com/"},{"name":"IXT","fullName":"iXledger","indexPrice":"0.4713","www":"https://www.ixledger.com/"},{"name":"INCNT","fullName":"Incent","indexPrice":"0.3314","www":"https://www.incentloyalty.com/"},{"name":"BDG","fullName":"BitDegree","indexPrice":"0.8765","www":"https://www.bitdegree.org/"},{"name":"PLBT","fullName":"Polybius","indexPrice":"11.53","www":"https://polybius.io/"},{"name":"STX","fullName":"Stox","indexPrice":"12.49","www":"https://www.stox.com/"},{"name":"EKO","fullName":"EchoLink","indexPrice":"0.27","www":"https://echolink.info/"},{"name":"CFT","fullName":"CryptoForecast","indexPrice":"0.0374","www":"https://cryptoforecast.com/"},{"name":"ETBS","fullName":"Ethbits","indexPrice":"7.97","www":"https://www.ethbits.com/"},{"name":"GCS","fullName":"Gamechain System","indexPrice":"0.11","www":"https://blockchain.game/"},{"name":"XLC","fullName":"LeviarCoin","indexPrice":"0.0803","www":"https://leviarcoin.org/"},{"name":"DDF","fullName":"Digital Developers Fund","indexPrice":"2","www":"https://www.digitaldevelopersfund.com/"},{"name":"MANA","fullName":"Decentraland","indexPrice":"0.16","www":"https://decentraland.org/"},{"name":"CND","fullName":"Cindicator","indexPrice":"0.066","www":"https://cindicator.com/"},{"name":"ICN","fullName":"Iconomi","indexPrice":"0.8381","www":"https://www.iconomi.net/"},{"name":"DBC","fullName":"DeepBrain Chain","indexPrice":"0.1","www":"https://www.deepbrainchain.org/"},{"name":"CVC","fullName":"Civic","indexPrice":"0.6798","www":"https://www.civic.com/"},{"name":"DTR","fullName":"Dynamic Trading Rights","indexPrice":"0.00066","www":"https://www.tokens.net/"},{"name":"POE","fullName":"Po.et","indexPrice":"0.0427","www":"https://po.et/"},{"name":"SMT","fullName":"SmartMesh","indexPrice":"0.1068","www":"https://smartmesh.io/"},{"name":"DENT","fullName":"Dentcoin","indexPrice":"0.003451","www":"http://www.dentcoin.com/"},{"name":"RLC","fullName":"iExec RLC","indexPrice":"1.4","www":"http://iex.ec/"},{"name":"CMT","fullName":"CyberMiles","indexPrice":"0.34","www":"https://www.cybermiles.io/"},{"name":"ANT","fullName":"Aragon","indexPrice":"6.21","www":"https://aragon.one/"},{"name":"GNO","fullName":"Gnosis","indexPrice":"215","www":"https://gnosis.pm/"},{"name":"MTL","fullName":"Metal","indexPrice":"3.13","www":"https://www.metalpay.com/"},{"name":"SAN","fullName":"Santiment Network Token","indexPrice":"2.85","www":"https://santiment.net/"},{"name":"TNB","fullName":"Time New Bank","indexPrice":"0.105","www":"https://tnb.fund/"},{"name":"ABT","fullName":"ArcBlock","indexPrice":"4.42","www":"https://www.arcblock.io/"},{"name":"ENJ","fullName":"Enjin Coin","indexPrice":"0.19","www":"https://enjincoin.io/"},{"name":"RDN","fullName":"Raiden Network Token","indexPrice":"4.5","www":"https://raiden.network/"},{"name":"SPHTX","fullName":"SophiaTX","indexPrice":"3","www":"https://www.sophiatx.com/"},{"name":"MDS","fullName":"MediShares","indexPrice":"0.17","www":"http://www.medishares.org/"},{"name":"INT","fullName":"INT chain","indexPrice":"0.28","www":"https://intchain.io/"},{"name":"GNX","fullName":"Genaro Network","indexPrice":"0.85","www":"https://genaro.network/en"},{"name":"AMB","fullName":"Ambrosus","indexPrice":"1.75","www":"https://ambrosus.com/"},{"name":"PLR","fullName":"Pillar","indexPrice":"0.2809","www":"https://pillarproject.io/"},{"name":"VEE","fullName":"BLOCKv","indexPrice":"0.0643","www":"https://blockv.io/"},{"name":"SRN","fullName":"Sirin Labs","indexPrice":"8.25","www":"https://sirinlabs.com/"},{"name":"BLZ","fullName":"Bluzelle","indexPrice":"0.79","www":"https://bluzelle.com/"},{"name":"RUFF","fullName":"Ruff","indexPrice":"0.385","www":"https://bluzelle.com/"},{"name":"AST","fullName":"AirSwap","indexPrice":"1.58","www":"https://www.airswap.io/"},{"name":"GVT","fullName":"Genesis Vision","indexPrice":"5.94","www":"https://genesis.vision/"},{"name":"LEND","fullName":"EthLend","indexPrice":"0.11","www":"https://ethlend.io/"},{"name":"BAY","fullName":"BitBay","indexPrice":"0.0066","www":"http://bitbay.market/"},{"name":"QRL","fullName":"Quantum Resistant Ledger","indexPrice":"0.5407","www":"https://theqrl.org/"},{"name":"SNM","fullName":"SONM","indexPrice":"0.535","www":"https://sonm.io/"},{"name":"ADX","fullName":"AdEx","indexPrice":"0.7662","www":"https://www.adex.network/"},{"name":"CLOAK","fullName":"CloakCoin","indexPrice":"1.13","www":"https://www.cloakcoin.com/"},{"name":"C20","fullName":"CRYPTO20","indexPrice":"6.77","www":"https://crypto20.com/"},{"name":"EDO","fullName":"Eidoo","indexPrice":"8.12","www":"https://eidoo.io/"},{"name":"CHAT","fullName":"ChatCoin","indexPrice":"1.3","www":"http://beechat.com/"},{"name":"TEL","fullName":"Telcoin","indexPrice":"0.0085","www":"https://www.telco.in/"},{"name":"RPX","fullName":"RED PULSE","indexPrice":"0.225","www":"https://www.red-pulse.com/landing"},{"name":"DPY","fullName":"Delphy","indexPrice":"6.5","www":"https://delphy.org/"},{"name":"DNT","fullName":"district0x","indexPrice":"0.1054","www":"https://district0x.io/"},{"name":"HPB","fullName":"HPB","indexPrice":"1.75","www":"http://www.gxn.io/"},{"name":"VIBE","fullName":"VIBEHub","indexPrice":"0.066","www":"http://www.vibehub.io/"},{"name":"EDG","fullName":"Edgeless","indexPrice":"0.1569","www":"https://www.edgeless.io/"},{"name":"WABI","fullName":"WaBi","indexPrice":"1.6","www":"https://wacoin.io/"},{"name":"SNGLS","fullName":"SingularDTV","indexPrice":"0.1016","www":"https://singulardtv.com/"},{"name":"APPC","fullName":"AppCoins","indexPrice":"1.5","www":"https://appcoins.io/"},{"name":"PIX","fullName":"Lampix","indexPrice":"0.85","www":"https://lampix.com/"},{"name":"VSL","fullName":"vSlice","indexPrice":"0.3425","www":"https://ethplorer.io/address/0x5c543e7ae0a1104f78406c340e9c64fd9fce5170"},{"name":"ZRC","fullName":"ZrCoin (Pre-L...","indexPrice":"9.63","www":"https://zrcoin.io/"},{"name":"CREA","fullName":"Creativecoin","indexPrice":"0.2601","www":"https://www.creativechain.org/project/"},{"name":"HMC","fullName":"Hi Mutual Society","indexPrice":"0.66","www":"https://www.hms.io/"},{"name":"YEE","fullName":"Yee Token","indexPrice":"0.11","www":"http://www.yeefoundation.com/home"},{"name":"ELF","fullName":"ELF","indexPrice":"0.654","www":"https://aelf.io/"},{"name":"IOST","fullName":"Internet of Services","indexPrice":"0.066","www":"https://iost.io/"},{"name":"KCASH","fullName":"KCASH","indexPrice":"0.48","www":"https://www.kcash.com/"},{"name":"VIA","fullName":"Viacoin","indexPrice":"0.244","www":"https://viacoin.org/"},{"name":"UTK","fullName":"UTRUST","indexPrice":"0.44","www":"https://utrust.io/"},{"name":"XAS","fullName":"Asch","indexPrice":"0.2","www":"https://www.asch.io/"},{"name":"SPANK","fullName":"SpankChain","indexPrice":"0.1568","www":"https://spankchain.com/"},{"name":"WGR","fullName":"Wagerr","indexPrice":"0.2475","www":"https://www.wagerr.com/"},{"name":"HVN","fullName":"Hive Project","indexPrice":"0.1521","www":"https://hive-project.net/"},{"name":"TNT","fullName":"Tierion","indexPrice":"0.482","www":"https://tierion.com/"},{"name":"WINGS","fullName":"Wings","indexPrice":"0.1845","www":"https://wings.ai/"},{"name":"OCN","fullName":"Ocoin","indexPrice":"0.076","www":"http://www.ocoins.cc/"},{"name":"QLC","fullName":"Qlink","indexPrice":"0.93","www":"https://qlcchain.org/"},{"name":"FUEL","fullName":"EtherParty","indexPrice":"1","www":"https://etherparty.io/"},{"name":"XCP","fullName":"Counterparty","indexPrice":"4.01","www":"http://counterparty.io/"},{"name":"TAAS","fullName":"TaaS","indexPrice":"6.41","www":"https://taas.fund/"},{"name":"DCT","fullName":"DECENT","indexPrice":"0.7988","www":"https://decent.ch/"},{"name":"COSS","fullName":"COSS","indexPrice":"0.0998","www":"https://coss.io/"},{"name":"OST","fullName":"Simple Token","indexPrice":"0.508","www":"https://simpletoken.org/"},{"name":"MLN","fullName":"Melon","indexPrice":"39.84","www":"https://melonport.com/"},{"name":"PRE","fullName":"Presearch","indexPrice":"0.099","www":"https://www.presearch.io/"},{"name":"BRD","fullName":"Bread","indexPrice":"5.5","www":"https://token.breadapp.com/en/"},{"name":"TKN","fullName":"TokenCard","indexPrice":"3.45","www":"https://tokencard.io/"},{"name":"CDT","fullName":"Blox","indexPrice":"0.24","www":"https://www.coindash.io/"},{"name":"MGO","fullName":"MobileGo","indexPrice":"5.22","www":"https://mobilego.io/"},{"name":"ETP","fullName":"Metaverse ETP","indexPrice":"0.77","www":"https://mvs.org/"},{"name":"NGC","fullName":"NAGA","indexPrice":"6.6","www":"https://www.nagaico.com/"},{"name":"ADT","fullName":"adToken","indexPrice":"0.1048","www":"https://adtoken.com/"},{"name":"GUP","fullName":"Matchpool","indexPrice":"0.5736","www":"https://matchpool.co/"},{"name":"BCAP","fullName":"BCAP","indexPrice":"6.9","www":"http://blockchain.capital/"},{"name":"HST","fullName":"Decision Token","indexPrice":"0.154","www":"https://horizonstate.com/"},{"name":"VIB","fullName":"Viberate","indexPrice":"0.6","www":"https://www.viberate.com/"},{"name":"TAU","fullName":"Lamden","indexPrice":"0.39","www":"https://www.lamden.io/"},{"name":"COB","fullName":"Cobinhood","indexPrice":"0.4","www":"https://cobinhood.com/"},{"name":"1ST","fullName":"FirstBlood","indexPrice":"0.4616","www":"https://firstblood.io/"},{"name":"CFI","fullName":"Cofound.it","indexPrice":"0.805","www":"https://cofound.it/"},{"name":"HMQ","fullName":"Humaniq","indexPrice":"0.2542","www":"https://humaniq.co/"},{"name":"PRO","fullName":"Propy","indexPrice":"2.74","www":"https://propy.com/"},{"name":"BMC","fullName":"Blackmoon Crypto","indexPrice":"6.57","www":"https://www.blackmooncrypto.com/"},{"name":"LUN","fullName":"Lunyr","indexPrice":"11.12","www":"https://lunyr.com/"},{"name":"AMP","fullName":"Synereo","indexPrice":"1.07","www":"http://www.synereo.com/"},{"name":"TRST","fullName":"WeTrust","indexPrice":"0.4015","www":"https://www.wetrust.io/"}];
var index = 0;//爬虫变量
var length = 0; //递归函数变量
var ICOArr = [];
//console.log(tokenNameListArr[11]);
	function digui(i) {
		if (i==tokenNameListArr.length-1) {
			console.log("爬取完毕....");
			return;
		}
		setTimeout(function(){
			//爬虫======================================================
			GetUrl(`https://www.feixiaohao.com/currencies/${tokenNameListArr[i].fullName}/`,data=>{ //把函数传入
					var htmlContent = gbk.decode(data, 'utf-8');
					let DOM = new JSDOM(htmlContent);
					let document = DOM.window.document;
					//var index = html.split('baseInfo');
					// var index2 = index[1];
					if (htmlContent.indexOf('网站1')!=-1) { //存在
						console.log("存在")
						var str1 = htmlContent.split('网站');
						var str2 = str1[1];
						//var str3 = str2[1];

						console.log("网址:",str2);
						//tokenNameListArr[i].www = str3;

						//fs.writeFileSync("./myData.json",JSON.stringify(tokenNameListArr));
						console.log("i:"+i);
						digui(i+1);
					}else{ //不存在
						console.log("不存在")
						console.log("i:"+i);
						digui(i+1);
					}
					
					console.log('/getMarket接口 爬取成功')
					
					//returnDataUp();
				})
			function GetUrl(sUrl,success){
				index++; //计算爬取到的302重定向次数
				var urlObj = url.parse(sUrl)
				var http = "";
				if (urlObj.protocol=='http:') {
					http = require('http')  
					//有些图片网页是https的 http环境下的js文件跨域爬取网页会出错
				}else{
					http = require('https')
				}
				//设置访问服务器(网站)的参数
				let req = http.request({  //request 默认post方式访问
					'hostname':urlObj.hostname,
					'path':urlObj.path
				},res=>{
					//如果状态码是200 说明找到真身页面了
					if (res.statusCode==200) {
						var arr = []
						res.on('data',buffer=>{
							arr.push(buffer)
						})//如果res接收到数据 则触发data事件 则把数据buffer变量放进数组里

						res.on('end',()=>{ 
							let b = Buffer.concat(arr) //爬取图片必须先利用该方法把转换参数2进制才可以

							//如果函数存在，则执行该函数 
							success && success(b) //穿参数b
				 		})
					}else if(res.statusCode==302||res.statusCode==301){
						//如果状态码是302说明是重定向的虚拟假网页
						//执行以下代码继续爬取
						console.log(`我是第${index}次重定向！`)
						GetUrl(res.headers.location,success)//此处就是回调函数
					}else if(res.statusCode==500){
						console.log('页面报错500');
						console.log("i:"+i);
						digui(i+1);
					}
					
				})

				req.end()
				//404页面
				req.on('error',()=>{
					console.log('404页面 访问出错')
				})
			}
			//爬虫======================================================
		},1000);
	};
	//digui(11);

app.listen(30088, function(){  
	console.log("http server running on localhost:30088");
});