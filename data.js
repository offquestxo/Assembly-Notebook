/* Content data — copied unchanged from prototype/tin-cay-notebook.html (sources: wol.jw.org program + review questions). */
const THEME = {en:"“Happy Is the One Trusting In Jehovah”", vi:"“Người tin cậy Đức Giê-hô-va thật hạnh phúc!”", refEn:"Proverbs 16:20", refVi:"Châm ngôn 16:20"};
const SONG_URL = (k,lang)=> lang==='vi' ? `https://wol.jw.org/vi/wol/pc/r47/lp-vt/1102027246/${k}/0` : `https://wol.jw.org/en/wol/pc/r1/lp-e/1102027246/${k}/0`;
const PROGRAM = [
 {session:'am', items:[
  {t:'9:40', type:'music'},
  {t:'9:50', type:'song', n:31, k:0, extra:'prayer'},
  {t:'10:00', type:'talk', id:'t1', voc:'t1', rq:1, en:'Why “Trust In Jehovah With All Your Heart”?', vi:'Tại sao nên “hết lòng tin cậy Đức Giê-hô-va”?'},
  {t:'10:15', type:'sym', id:'s1', voc:'s1', rq:2, en:'Imitate Those Who Trusted In Jehovah!', vi:'Noi gương những người tin cậy Đức Giê-hô-va!', parts:[
    {id:'s1a', en:'Barak', vi:'Ba-rác'},
    {id:'s1b', en:'The Shunammite Woman', vi:'Người đàn bà Su-nem'},
    {id:'s1c', en:'Daniel, Hananiah, Mishael, and Azariah', vi:'Đa-ni-ên, Ha-na-nia, Mi-sa-ên và A-xa-ria'}]},
  {t:'11:05', type:'song', n:57, k:1, extra:'ann'},
  {t:'11:15', type:'talk', id:'t2', voc:'t2', rq:3, en:'Help Others Trust In the “Living and True God”', vi:'Giúp người khác tin cậy “Đức Chúa Trời thật và hằng sống”'},
  {t:'11:35', type:'talk', id:'t3', voc:'t3', label:['Baptism','Báp-têm'], en:'“Your Father Who Looks On in Secret Will Repay You”', vi:'‘Cha trên trời, là đấng nhìn từ nơi kín đáo, sẽ thưởng cho anh em’'},
  {t:'12:05', type:'song', n:29, k:2},
 ]},
 {session:'pm', items:[
  {t:'1:20', type:'music'},
  {t:'1:30', type:'song', n:8, k:3, extra:'prayer'},
  {t:'1:35', type:'talk', id:'t4', voc:'t4', label:['Public Bible Discourse','Diễn văn công cộng'], en:'Whom Can You Really Trust?', vi:'Ai thật sự đáng tin cậy?'},
  {t:'2:05', type:'talk', id:'t5', voc:'t5', en:'Summary of The Watchtower', vi:'Tóm lược bài học Tháp Canh'},
  {t:'2:35', type:'song', n:135, k:4, extra:'ann'},
  {t:'2:45', type:'sym', id:'s2', voc:'s2', rq:4, en:'Trust In Jehovah’s Wisdom', vi:'Tin cậy nơi sự khôn ngoan của Đức Giê-hô-va', parts:[
    {id:'s2a', en:'When Guiding Your Children', vi:'Khi hướng dẫn con cái'},
    {id:'s2b', en:'When Planning Your Future', vi:'Khi lên kế hoạch cho tương lai'},
    {id:'s2c', en:'When Facing Temptation', vi:'Khi đối mặt với cám dỗ'}]},
  {t:'3:30', type:'talk', id:'t6', voc:'t6', rq:5, en:'“Happy Is the One Trusting In Jehovah”', vi:'“Người tin cậy Đức Giê-hô-va thật hạnh phúc!”'},
  {t:'4:00', type:'song', n:54, k:5, extra:'prayer'},
 ]}
];
const RQ = {
 1:{en:'How do we show that we ‘trust in Jehovah with all our heart’?', vi:'Làm thế nào để cho thấy mình hết lòng tin cậy Đức Giê-hô-va?', refs:['p3_5']},
 2:{en:'How can we imitate Barak, the Shunammite woman, and Daniel, Hananiah, Mishael, and Azariah?', vi:'Chúng ta có thể noi gương Ba-rác, người đàn bà Su-nem, Đa-ni-ên, Ha-na-nia, Mi-sa-ên và A-xa-ria như thế nào?', refs:['lk16_10','ps50_15','ps119_112']},
 3:{en:'How can we start conversations with people whose background or thinking differs greatly from ours?', vi:'Làm sao để bắt đầu cuộc trò chuyện với những người có gốc gác hay lối suy nghĩ rất khác với chúng ta?', refs:['co9_19']},
 4:{en:'Why trust in Jehovah’s wisdom?', vi:'Tại sao có thể tin cậy nơi sự khôn ngoan của Đức Giê-hô-va?', refs:['p3_13','p3_18','p16_3','p22_6','co10_13']},
 5:{en:'Why should we always trust in Jehovah?', vi:'Tại sao chúng ta nên luôn tin cậy Đức Giê-hô-va?', refs:['p16_20']},
};
const BC = (doc,a,b,lang)=> lang==='vi' ? `https://wol.jw.org/vi/wol/bc/r47/lp-vt/${doc}/${a}/${b}` : `https://wol.jw.org/en/wol/bc/r1/lp-e/${doc}/${a}/${b}`;
const VERSES = [
 {id:'p16_20', en:'Proverbs 16:20', vi:'Châm ngôn 16:20', doc:1102027246, a:0, b:0, note:['Theme scripture','Câu Kinh Thánh chủ đề']},
 {id:'p3_5', en:'Proverbs 3:5, 6', vi:'Châm ngôn 3:5, 6', doc:1102027247, a:0, b:0},
 {id:'lk16_10', en:'Luke 16:10', vi:'Lu-ca 16:10', doc:1102027247, a:1, b:0},
 {id:'ps50_15', en:'Psalm 50:15', vi:'Thi thiên 50:15', doc:1102027247, a:1, b:1},
 {id:'ps119_112', en:'Psalm 119:112', vi:'Thi thiên 119:112', doc:1102027247, a:1, b:2},
 {id:'co9_19', en:'1 Corinthians 9:19-23', vi:'1 Cô-rinh-tô 9:19-23', doc:1102027247, a:2, b:0},
 {id:'p3_13', en:'Proverbs 3:13', vi:'Châm ngôn 3:13', doc:1102027247, a:3, b:0},
 {id:'p3_18', en:'Proverbs 3:18', vi:'Châm ngôn 3:18', doc:1102027247, a:3, b:1},
 {id:'p16_3', en:'Proverbs 16:3', vi:'Châm ngôn 16:3', doc:1102027247, a:3, b:2},
 {id:'p22_6', en:'Proverbs 22:6', vi:'Châm ngôn 22:6', doc:1102027247, a:3, b:3},
 {id:'co10_13', en:'1 Corinthians 10:13', vi:'1 Cô-rinh-tô 10:13', doc:1102027247, a:3, b:4},
];
/* Vocabulary. src: prog = wording taken from this program on wol.jw.org; unv = general dictionary, not verified against JW usage. */
const VOCAB = {
 theme:{en:'Theme', vi:'Chủ đề', w:[
  ['tin cậy','teen kuh-ee','to trust','prog'],
  ['hạnh phúc','hahng fook','happy','prog','South: hahn fook'],
  ['Đức Giê-hô-va','dook zay-hoh-vah','Jehovah','prog','North “Gi” = z; South “Gi” = y (dook yay-hoh-vah)'],
  ['thật','tuht','truly / really','prog'],
 ]},
 t1:{en:'Why trust with all your heart', vi:'Hết lòng tin cậy', w:[
  ['hết lòng','het lawng','with all (your) heart','prog'],
  ['tại sao','tie sow','why','prog'],
  ['Châm ngôn','chum ngohn','Proverbs','prog'],
  ['nương cậy','nuhng kuh-ee','to rely on','prog','Seen in a 2023 meeting workbook title on wol.jw.org'],
 ]},
 s1:{en:'Imitate those who trusted', vi:'Noi gương', w:[
  ['thuyết trình phối hợp','twee-et cheeng foy hup','symposium','prog','North “tr” = ch; South keeps a “tr” sound'],
  ['noi gương','noy guhng','to imitate / follow the example','prog'],
  ['Ba-rác','bah-rahk','Barak','prog'],
  ['người đàn bà Su-nem','nguh-ee dahn bah soo-nem','the Shunammite woman','prog'],
  ['Đa-ni-ên','dah-nee-en','Daniel','prog'],
  ['Ha-na-nia, Mi-sa-ên, A-xa-ria','hah-nah-nee-ah, mee-sah-en, ah-sah-ree-ah','Hananiah, Mishael, Azariah','prog'],
  ['sống lại','sohng lie','raised back to life','prog','From the program’s cover picture caption'],
 ]},
 t2:{en:'Help others trust', vi:'Giúp người khác', w:[
  ['giúp người khác','zoop nguh-ee khahk','help others','prog','South: yoop'],
  ['Đức Chúa Trời thật và hằng sống','dook chwah choy tuht vah hahng sohng','the living and true God','prog','North “Trời” = choy; South closer to troy'],
  ['cuộc trò chuyện','kwohk chaw chwee-en','a conversation','prog'],
  ['gốc gác','gohk gahk','background (where someone comes from)','prog'],
  ['lối suy nghĩ','loy swee ngee','way of thinking','prog'],
  ['bắt đầu','baht dow','to start','prog'],
 ]},
 t3:{en:'Baptism', vi:'Báp-têm', w:[
  ['báp-têm','bahp tem','baptism','prog'],
  ['Cha trên trời','chah chen choy','Father in heaven','prog','South: chah tren troy'],
  ['nơi kín đáo','nuh-ee keen dow','in secret','prog'],
  ['thưởng','thuhng','to reward / repay','prog'],
  ['dâng mình','zuhng ming','to dedicate oneself','unv','South: yuhng ming'],
 ]},
 t4:{en:'Public discourse', vi:'Diễn văn công cộng', w:[
  ['diễn văn công cộng','zee-en vahn kohng kohng','public discourse','prog','South: yee-ung yahng kohng kohng'],
  ['ai','eye','who','prog'],
  ['thật sự','tuht suh','really','prog'],
  ['đáng tin cậy','dahng teen kuh-ee','trustworthy','prog'],
 ]},
 t5:{en:'Watchtower summary', vi:'Tóm lược Tháp Canh', w:[
  ['Tháp Canh','tahp kahng','The Watchtower','prog','South: tahp kahn'],
  ['tóm lược','tawm luh-uhk','summary','prog'],
  ['bài học','bye hawk','lesson / study article','prog'],
 ]},
 s2:{en:'Trust in Jehovah’s wisdom', vi:'Sự khôn ngoan', w:[
  ['sự khôn ngoan','suh khohn ngwahn','wisdom','prog'],
  ['hướng dẫn con cái','huh-uhng zuhn kawn kye','guide (your) children','prog','South: yuhng'],
  ['lên kế hoạch','len keh hwahk','to make plans','prog'],
  ['tương lai','tuhng lie','the future','prog'],
  ['đối mặt với cám dỗ','doy maht vuh-ee kahm zoh','to face temptation','prog','South: kahm yoh'],
 ]},
 t6:{en:'Closing talk', vi:'Bài kết', w:[
  ['luôn','lwohn','always','prog'],
  ['chúng ta','choong tah','we (including you)','prog'],
  ['nên','nen','should','prog'],
 ]},
 meet:{en:'At the assembly', vi:'Tại hội nghị', w:[
  ['hội nghị vòng quanh','hoy ngee vawng kwahng','circuit assembly','prog'],
  ['giám thị vòng quanh','zahm tee vawng kwahng','circuit overseer','prog','South: yahm'],
  ['bài hát','bye haht','song','prog'],
  ['cầu nguyện','kow ngwee-en','prayer / to pray','prog'],
  ['thông báo','tohng bow','announcements','prog'],
  ['âm nhạc','uhm nyahk','music','prog'],
  ['buổi sáng / buổi chiều','bwoy sahng / bwoy chee-oo','morning / afternoon','prog'],
  ['Kinh Thánh','king tahng','the Bible','prog','South: kin tahn'],
  ['thánh chức','tahng chook','ministry','prog'],
  ['Chào anh / Chào chị','chow ahng / chow chee','Hello (brother / sister)','unv'],
  ['Cảm ơn anh/chị','kahm uhn ahng / chee','Thank you (brother/sister)','unv'],
 ]},
};
const BINGO = {
 am:['tin cậy','hạnh phúc','Đức Giê-hô-va','hết lòng','Châm ngôn','noi gương','Ba-rác','Su-nem','Đa-ni-ên','sống lại','cầu nguyện','Kinh Thánh','giúp người khác','hằng sống','cuộc trò chuyện','gốc gác','suy nghĩ','báp-têm','Cha trên trời','kín đáo','thưởng','con trai','Đức Chúa Trời','thánh chức'],
 pm:['tin cậy','hạnh phúc','Đức Giê-hô-va','đáng tin cậy','Tháp Canh','khôn ngoan','con cái','hướng dẫn','tương lai','kế hoạch','cám dỗ','luôn','Châm ngôn','Kinh Thánh','cầu nguyện','gia đình','lời cầu nguyện','thật sự','bài học','hết lòng','Cha trên trời','quyết định','bình an','yêu thương'],
};
const BINGO_EN = {'tin cậy':'trust','hạnh phúc':'happy','Đức Giê-hô-va':'Jehovah','hết lòng':'whole heart','Châm ngôn':'Proverbs','noi gương':'imitate','Ba-rác':'Barak','Su-nem':'Shunammite','Đa-ni-ên':'Daniel','sống lại':'raised to life','cầu nguyện':'pray','Kinh Thánh':'Bible','giúp người khác':'help others','hằng sống':'living','cuộc trò chuyện':'conversation','gốc gác':'background','suy nghĩ':'thinking','báp-têm':'baptism','Cha trên trời':'Father in heaven','kín đáo':'in secret','thưởng':'reward','con trai':'son','Đức Chúa Trời':'God','thánh chức':'ministry','đáng tin cậy':'trustworthy','Tháp Canh':'Watchtower','khôn ngoan':'wisdom','con cái':'children','hướng dẫn':'guide','tương lai':'future','kế hoạch':'plans','cám dỗ':'temptation','luôn':'always','gia đình':'family','lời cầu nguyện':'a prayer','thật sự':'really','bài học':'lesson','quyết định':'decision','bình an':'peace','yêu thương':'love'};

const MAX_PEOPLE = 20;
const COLORS = ['#3E7CB1','#C2569B','#2E9A75','#CF7F26','#7A62C9','#C0473F','#3C9DB5',
  '#8A6D1E','#B4528A','#4F8A3A','#D0603A','#5468C8','#9A4FB0','#2F8C8C','#B85C6B','#6E7F2A','#C27A1E','#4B6FA0','#A0522D','#5B8F6E'];
const UI = {
 program:['Program','Chương trình'], games:['Games','Trò chơi'], words:['Words','Từ vựng'], chat:['Family','Gia đình'], ask:['Ask AI','Hỏi AI'],
 morning:['Morning','Buổi sáng'], afternoon:['Afternoon','Buổi chiều'], music:['Music','Âm nhạc'], song:['Song','Bài hát'], prayer:['and Prayer','và cầu nguyện'], ann:['and Announcements','và thông báo'],
 symposium:['Symposium','Thuyết trình phối hợp'], part:['Part','Phần'], talk:['Talk','Bài giảng'], listenFor:['Listen for the answer','Lắng nghe để tìm lời giải đáp'],
 myNotes:['My notes','Ghi chú của tôi'], notePh:['Type the points you hear…','Ghi lại những điểm bạn nghe…'], family:['Family notes','Ghi chú của gia đình'], nobody:['No one else has written yet.','Chưa ai khác ghi chú.'],
 tryVi:['Help me say it in Vietnamese','Giúp tôi nói bằng tiếng Việt'], saved:['Saved','Đã lưu'], savedHere:['Saved on this phone','Đã lưu trên máy'],
 now:['Now','Đang diễn ra'], jump:['Go','Xem'], synced:['Synced with family','Đã đồng bộ'], waiting:['Saved here · will sync','Đã lưu · sẽ đồng bộ'], offline:['No signal · saved here','Mất sóng · đã lưu trên máy'], local:['This device only','Chỉ trên máy này'], readonly:['View only','Chỉ xem'],
 who:['Who’s listening?','Ai đang nghe?'], whoSub:['Pick your name. Each phone remembers who you are, and anyone can switch.','Chọn tên của bạn.'], add:['Add','Thêm'], addPh:['Name','Tên'], max:['Up to 20 people','Tối đa 20 người'], done:['Done','Xong'],
 score:['Family points','Điểm gia đình'], bingo:['Bingo','Bingo'], verses:['Scripture Hunt','Tìm câu Kinh Thánh'], match:['Word Match','Ghép từ'], review:['Review Questions','Câu hỏi ôn lại'],
 bingoHint:['Tap a word when the speaker says it. Five in a row wins a bingo.','Chạm vào từ khi diễn giả nói đến. Năm ô liên tiếp là bingo.'],
 versesHint:['Check off each scripture when it’s read. Add others you hear.','Đánh dấu mỗi câu Kinh Thánh khi được đọc.'],
 matchHint:['Tap a Vietnamese word, then its English meaning.','Chạm vào từ tiếng Việt, rồi nghĩa tiếng Anh.'],
 reviewHint:['From the program: “Find Answers to These Questions.” Write yours, then see what the family wrote.','Tìm lời giải đáp cho những câu hỏi sau.'],
 heard:['Heard it','Đã nghe'], read:['Read','Đọc'], addVerse:['Add a scripture you heard','Thêm câu Kinh Thánh bạn nghe'], newRound:['New round','Vòng mới'], wellDone:['All matched!','Ghép xong!'],
 yourAnswer:['Your answer','Câu trả lời của bạn'], free:['FREE','TỰ DO'],
 send:['Send','Gửi'], chatPh:['Message the family…','Nhắn cho gia đình…'], chatEmpty:['No messages yet. Say hi to the family.','Chưa có tin nhắn.'], translate:['Translate','Dịch'],
 askPh:['Ask a question or a translation…','Hỏi một câu hoặc nhờ dịch…'], askEmpty:['Ask anything about the program or Vietnamese words. This chat is just for you.','Hỏi bất cứ điều gì. Cuộc trò chuyện này chỉ dành cho bạn.'], clear:['Clear chat','Xóa'],
 tapReveal:['Tap for English','Chạm để xem tiếng Anh'], srcProg:['Per wol.jw.org (this program)','Theo wol.jw.org'], srcUnv:['General dictionary · not verified against JW usage','Từ điển chung · chưa kiểm chứng'],
 all:['All','Tất cả'], pronNote:['Pronunciation spellings are approximate. Check the audio in the JW Language app.','Cách đọc chỉ gần đúng.'],
};
const NOTE_IDS = ['t1','s1a','s1b','s1c','t2','t3','t4','t5','s2a','s2b','s2c','t6'];

/* ============ P1 GAME DATA ============ */
/* Bible book names. Vietnamese copied from the Bible index on wol.jw.org (https://wol.jw.org/vi/wol/binav/r47/lp-vt), Oct 10 2026. */
const BOOKS = [
 ['Genesis','Sáng thế'],['Exodus','Xuất Ai Cập'],['Leviticus','Lê-vi'],['Numbers','Dân số'],['Deuteronomy','Phục truyền luật lệ'],['Joshua','Giô-suê'],['Judges','Quan xét'],['Ruth','Ru-tơ'],['1 Samuel','1 Sa-mu-ên'],['2 Samuel','2 Sa-mu-ên'],['1 Kings','1 Các vua'],['2 Kings','2 Các vua'],['1 Chronicles','1 Sử ký'],['2 Chronicles','2 Sử ký'],['Ezra','Ê-xơ-ra'],['Nehemiah','Nê-hê-mi'],['Esther','Ê-xơ-tê'],['Job','Gióp'],['Psalms','Thi thiên'],['Proverbs','Châm ngôn'],['Ecclesiastes','Truyền đạo'],['Song of Solomon','Nhã ca'],['Isaiah','Ê-sai'],['Jeremiah','Giê-rê-mi'],['Lamentations','Ai ca'],['Ezekiel','Ê-xê-chi-ên'],['Daniel','Đa-ni-ên'],['Hosea','Ô-sê'],['Joel','Giô-ên'],['Amos','A-mốt'],['Obadiah','Áp-đia'],['Jonah','Giô-na'],['Micah','Mi-chê'],['Nahum','Na-hum'],['Habakkuk','Ha-ba-cúc'],['Zephaniah','Xô-phô-ni'],['Haggai','Ha-gai'],['Zechariah','Xa-cha-ri'],['Malachi','Ma-la-chi'],
 ['Matthew','Ma-thi-ơ'],['Mark','Mác'],['Luke','Lu-ca'],['John','Giăng'],['Acts','Công vụ'],['Romans','Rô-ma'],['1 Corinthians','1 Cô-rinh-tô'],['2 Corinthians','2 Cô-rinh-tô'],['Galatians','Ga-la-ti'],['Ephesians','Ê-phê-sô'],['Philippians','Phi-líp'],['Colossians','Cô-lô-se'],['1 Thessalonians','1 Tê-sa-lô-ni-ca'],['2 Thessalonians','2 Tê-sa-lô-ni-ca'],['1 Timothy','1 Ti-mô-thê'],['2 Timothy','2 Ti-mô-thê'],['Titus','Tít'],['Philemon','Phi-lê-môn'],['Hebrews','Hê-bơ-rơ'],['James','Gia-cơ'],['1 Peter','1 Phi-e-rơ'],['2 Peter','2 Phi-e-rơ'],['1 John','1 Giăng'],['2 John','2 Giăng'],['3 John','3 Giăng'],['Jude','Giu-đe'],['Revelation','Khải huyền'],
];

/* Who Am I? Names: program spellings, or the Vietnamese NWT on wol.jw.org (Judges 4, 2 Kings 4, Daniel 1:7).
   Clues summarise Judges 4–5, 2 Kings 4, Daniel 1–3 in our own words. Vietnamese clue wording is ours — not verified against JW usage. */
const WHO = [
 {id:'barak', en:'Barak', vi:'Ba-rác', clues:[
  ['I was a man of Israel called to lead an army against a strong enemy.','Tôi là một người Y-sơ-ra-ên được gọi để dẫn đầu một đạo quân chống lại kẻ thù mạnh.'],
  ['The prophetess Deborah told me to gather 10,000 men at Mount Tabor.','Nữ tiên tri Đê-bô-ra bảo tôi tập hợp 10.000 người tại núi Tha-bô.'],
  ['I led my men down the mountain, and Jehovah threw Sisera’s army and chariots into confusion.','Tôi dẫn quân xuống núi, và Đức Giê-hô-va làm cho quân lính và chiến xa của Si-sê-ra bị rối loạn.']]},
 {id:'deborah', en:'Deborah', vi:'Đê-bô-ra', clues:[
  ['I was a prophetess, and I judged Israel.','Tôi là nữ tiên tri và xét xử dân Y-sơ-ra-ên.'],
  ['People came to me for judgment where I sat under a palm tree.','Dân chúng đến gặp tôi để được xét xử dưới một cây chà là.'],
  ['I called Barak and went with him to battle; afterward we sang a song of victory.','Tôi gọi Ba-rác và cùng ông ra trận; sau đó chúng tôi hát một bài ca chiến thắng.']]},
 {id:'shunammite', en:'The Shunammite woman', vi:'Người đàn bà Su-nem', clues:[
  ['I often invited a prophet to eat at our home.','Tôi thường mời một nhà tiên tri đến dùng bữa tại nhà mình.'],
  ['My husband and I made him a small room on the roof with a bed, a table, a chair, and a lamp.','Vợ chồng tôi làm cho ông một phòng nhỏ trên mái nhà, có giường, bàn, ghế và đèn.'],
  ['My son died, but I went straight to the prophet, and my son was brought back to life.','Con trai tôi chết, nhưng tôi đi ngay đến gặp nhà tiên tri, và con tôi được sống lại.']]},
 {id:'elisha', en:'Elisha', vi:'Ê-li-sê', clues:[
  ['I was a prophet who served after Elijah.','Tôi là một nhà tiên tri phụng sự sau Ê-li.'],
  ['A kind couple in Shunem made a room for me in their house.','Một cặp vợ chồng tử tế ở Su-nem làm cho tôi một phòng trong nhà họ.'],
  ['My attendant was Gehazi. I prayed to Jehovah, and the woman’s son came back to life.','Người phục vụ tôi là Ghê-ha-xi. Tôi cầu nguyện với Đức Giê-hô-va, và con trai của bà ấy sống lại.']]},
 {id:'daniel', en:'Daniel', vi:'Đa-ni-ên', clues:[
  ['As a young man, I was taken from Jerusalem to Babylon.','Khi còn trẻ, tôi bị đưa từ Giê-ru-sa-lem đến Ba-by-lôn.'],
  ['I asked to eat vegetables and drink water instead of the king’s food.','Tôi xin được ăn rau và uống nước thay vì đồ ăn của vua.'],
  ['Jehovah helped me explain King Nebuchadnezzar’s dream of a huge image. In Babylon they called me Belteshazzar.','Đức Giê-hô-va giúp tôi giải nghĩa giấc mơ của vua Nê-bu-cát-nết-xa về một pho tượng lớn. Ở Ba-by-lôn, tôi được gọi là Ben-tơ-sát-xa.']]},
 {id:'hananiah', en:'Hananiah', vi:'Ha-na-nia', clues:[
  ['I was a young man from Judah, taken to Babylon with Daniel and two other friends.','Tôi là một thanh niên người Giu-đa, bị đưa đến Ba-by-lôn cùng Đa-ni-ên và hai người bạn khác.'],
  ['I would not bow down to the gold image, so I was thrown into the fiery furnace — and came out unharmed.','Tôi không chịu quỳ lạy pho tượng bằng vàng nên bị quăng vào lò lửa, nhưng ra khỏi lò mà không hề hấn gì.'],
  ['In Babylon my name was Shadrach.','Ở Ba-by-lôn, tên tôi là Sa-đơ-rắc.']]},
 {id:'mishael', en:'Mishael', vi:'Mi-sa-ên', clues:[
  ['I was a young man from Judah, taken to Babylon with Daniel and two other friends.','Tôi là một thanh niên người Giu-đa, bị đưa đến Ba-by-lôn cùng Đa-ni-ên và hai người bạn khác.'],
  ['I would not bow down to the gold image, so I was thrown into the fiery furnace — and came out unharmed.','Tôi không chịu quỳ lạy pho tượng bằng vàng nên bị quăng vào lò lửa, nhưng ra khỏi lò mà không hề hấn gì.'],
  ['In Babylon my name was Meshach.','Ở Ba-by-lôn, tên tôi là Mê-sác.']]},
 {id:'azariah', en:'Azariah', vi:'A-xa-ria', clues:[
  ['I was a young man from Judah, taken to Babylon with Daniel and two other friends.','Tôi là một thanh niên người Giu-đa, bị đưa đến Ba-by-lôn cùng Đa-ni-ên và hai người bạn khác.'],
  ['I would not bow down to the gold image, so I was thrown into the fiery furnace — and came out unharmed.','Tôi không chịu quỳ lạy pho tượng bằng vàng nên bị quăng vào lò lửa, nhưng ra khỏi lò mà không hề hấn gì.'],
  ['In Babylon my name was Abednego.','Ở Ba-by-lôn, tên tôi là A-bết-nê-gô.']]},
];

/* Tone Marks: syllables from this program's vocabulary, grouped by tone. */
const TONES = [
 {id:'ngang', mark:'—', en:'level (no mark)', vi:'thanh ngang', w:[['tin','trust'],['ai','who'],['luôn','always'],['nên','should'],['khôn','wise'],['sao','why'],['Canh','watch (Tháp Canh)']]},
 {id:'huyen', mark:'`', en:'falling (huyền)', vi:'thanh huyền', w:[['lòng','heart'],['đầu','start (bắt đầu)'],['trời','heaven'],['bài','talk / song'],['vòng','circuit'],['trò','chat (trò chuyện)']]},
 {id:'sac', mark:'´', en:'rising (sắc)', vi:'thanh sắc', w:[['phúc','happy (hạnh phúc)'],['khác','other'],['sống','living'],['Thánh','holy'],['đáng','worthy'],['bắt','start (bắt đầu)']]},
 {id:'hoi', mark:'̉', en:'dipping (hỏi)', vi:'thanh hỏi', w:[['chủ','theme (chủ đề)'],['thưởng','reward'],['buổi','session'],['cảm','thank (cảm ơn)'],['kể','to tell'],['hỏi','to ask']]},
 {id:'nga', mark:'~', en:'broken (ngã)', vi:'thanh ngã', w:[['nghĩ','think'],['dỗ','tempt (cám dỗ)'],['diễn','discourse (diễn văn)'],['dẫn','guide (hướng dẫn)'],['lễ','ceremony']]},
 {id:'nang', mark:'̣', en:'heavy (nặng)', vi:'thanh nặng', w:[['cậy','trust (tin cậy)'],['hạnh','happy (hạnh phúc)'],['thật','true'],['hội','assembly (hội nghị)'],['học','study'],['sự','(makes a noun)'],['lại','again'],['mặt','face']]},
];

/* Words people might guess for Prediction Cards (they can also type their own). */
const PREDICT_SUGGEST = ['tin cậy','hạnh phúc','Đức Giê-hô-va','Kinh Thánh','cầu nguyện','khôn ngoan','gia đình','hết lòng','noi gương','tương lai','yêu thương','đức tin'];
