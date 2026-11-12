// 數位科技概論（上）隨堂測驗卷 第3回：系統平台的組成架構 - 硬體（範圍：第3章）
// 試卷題目、答案與詳解完整資料庫

const QUIZ_INFO = {
  title: "數位科技概論（上）第3回隨堂測驗",
  subtitle: "系統平台的組成架構 - 硬體（範圍：第3章）",
  schoolInfo: "資訊科 二年仁班 / 座號：17",
  totalQuestions: 25,
  pointsPerQuestion: 4,
  totalScore: 100,
  defaultTimeMinutes: 25,
  originalSheets: [
    { title: "第 1 頁（第 1 ~ 13 題）", src: "15867.jpg" },
    { title: "第 2 頁（第 14 ~ 25 題）", src: "15868.jpg" }
  ]
};

const QUESTIONS = [
  {
    id: 1,
    page: 1,
    category: "記憶體架構",
    question: "隨機存取記憶體（RAM）區分為動態隨機存取記憶體（DRAM）及靜態隨機存取記憶體（SRAM）兩種，請問下列哪一項是SRAM優於DRAM的特點？",
    options: [
      { key: "A", text: "單位資料的存取速度較快" },
      { key: "B", text: "單位面積所能儲存資料量較多" },
      { key: "C", text: "需要持續充電更新（refresh），才能確保資料完整" },
      { key: "D", text: "每單位資料的儲存成本較低" }
    ],
    answer: "A",
    explanation: "SRAM（靜態隨機存取記憶體）利用正反器/電晶體電路儲存資料，存取速度極快且不需定時充電更新（Refresh），主要用於快取記憶體（Cache）；而 DRAM（動態隨機存取記憶體）使用電容器儲存電荷，需持續充電更新，但單位面積容量大、成本低，常用於主記憶體。因此 SRAM 優於 DRAM 的特點是存取速度較快。"
  },
  {
    id: 2,
    page: 1,
    category: "電腦五大單元",
    question: "傑克將iPhone手機拍攝的照片轉存到電腦中，並列印出來與朋友分享，請問列印設備在電腦的五大單元中，是歸屬為下列哪一種單元？",
    options: [
      { key: "A", text: "控制單元" },
      { key: "B", text: "輸入單元" },
      { key: "C", text: "輸出單元" },
      { key: "D", text: "記憶單元" }
    ],
    answer: "C",
    explanation: "電腦五大單元包含：輸入單元 (IU)、輸出單元 (OU)、記憶單元 (MU)、算術邏輯單元 (ALU)、控制單元 (CU)。印表機負責將電腦處理後的文字或影像轉印於紙張上展示給使用者，屬於輸出單元（Output Unit）。"
  },
  {
    id: 3,
    page: 1,
    category: "電腦五大單元",
    question: "下列對於電腦硬體五大單元的敘述何者有誤？",
    options: [
      { key: "A", text: "輸入單元：待處理的資料須經由此單元進入電腦" },
      { key: "B", text: "輸出單元：處理完成之資料由此單元送出" },
      { key: "C", text: "算術邏輯單元：所有的算術運算均在此單元完成" },
      { key: "D", text: "記憶單元：僅儲存輸入待處理之資料" }
    ],
    answer: "D",
    explanation: "記憶單元（Memory Unit）負責儲存輸入的原始資料、運算的中間資料、運算完的最終結果，以及各項程式指令，並非「僅」儲存輸入待處理的資料，故 (D) 選項敘述錯誤。"
  },
  {
    id: 4,
    page: 1,
    category: "電腦架構",
    question: "電腦基本架構中有數個主要的組成單元（或部門），其中負責存放電腦程式與資料的單元是：",
    options: [
      { key: "A", text: "算術與邏輯單元" },
      { key: "B", text: "輸入單元" },
      { key: "C", text: "記憶單元" },
      { key: "D", text: "控制單元" }
    ],
    answer: "C",
    explanation: "依馮·紐曼架構（內儲程式概念），記憶單元（Memory Unit）負責存放執行中或等待執行的電腦程式指令及運算所需資料。"
  },
  {
    id: 5,
    page: 1,
    category: "中央處理器 CPU",
    question: "在電腦的組成單元中，下列哪兩個單元合稱為中央處理單元？",
    options: [
      { key: "A", text: "輸入單元及控制單元" },
      { key: "B", text: "控制單元及算術／邏輯單元" },
      { key: "C", text: "輸入單元及輸出單元" },
      { key: "D", text: "算術／邏輯單元及記憶單元" }
    ],
    answer: "B",
    explanation: "中央處理單元（Central Processing Unit, CPU）由控制單元（Control Unit, CU）與算術邏輯單元（Arithmetic and Logic Unit, ALU）組合而成（內部亦包含暫存器 Registers）。"
  },
  {
    id: 6,
    page: 1,
    category: "輸入與輸出 I/O",
    question: "請問所謂的I/O指的是",
    options: [
      { key: "A", text: "1跟0" },
      { key: "B", text: "物聯網(IoT)" },
      { key: "C", text: "輸入與輸出" },
      { key: "D", text: "整合式辦公室系統(integrated office system)" }
    ],
    answer: "C",
    explanation: "I/O 即 Input / Output（輸入與輸出）的簡稱，泛指資料進入電腦系統與從系統輸出至外部設備的過程或介面設備。"
  },
  {
    id: 7,
    page: 1,
    category: "硬體介面與技術",
    question: "關於\"熱插拔\"的敘述，何者為真？",
    options: [
      { key: "A", text: "只能在開機的情況下插拔" },
      { key: "B", text: "只能在關機的情況下插拔" },
      { key: "C", text: "在關機及開機的情況下皆可插拔" },
      { key: "D", text: "只有當主機溫度高於一定溫度時才可插拔" }
    ],
    answer: "C",
    explanation: "「熱插拔」（Hot Swapping / Hot Plugging）是指硬體設備在電腦開機狀態下即可直接插拔而不會損毀硬體或導致系統崩潰（例如 USB 裝置）；而在電腦關機狀態下當然也可插拔，因此開機與關機狀態皆可插拔。"
  },
  {
    id: 8,
    page: 1,
    category: "主機板與插槽",
    question: "阿布想要為自己的筆記型電腦擴充2G的RAM，請問他應該將RAM安插在下列哪一種插槽？",
    options: [
      { key: "A", text: "記憶體插槽" },
      { key: "B", text: "PCI-E插槽" },
      { key: "C", text: "CPU插槽" },
      { key: "D", text: "M.2插槽" }
    ],
    answer: "A",
    explanation: "RAM（隨機存取記憶體）必須插在專屬的記憶體插槽（筆電通常為 SO-DIMM 插槽）。PCI-E 常用於桌機介面卡，CPU 放置於 CPU Socket，M.2 則主要用於 SSD 或 Wi-Fi 網卡。"
  },
  {
    id: 9,
    page: 1,
    category: "電腦五大單元",
    question: "微軟公司在台灣成立了亞洲第一座「雲端運算」中心，以整合電腦的運算資源，來提供給國內各項創新研究計畫使用。一般而言，研究計畫都需要大量的運算，包括計算、比對、配對等不同的處理，請問電腦中負責這些運算工作的是下列哪一個單元？",
    options: [
      { key: "A", text: "CU" },
      { key: "B", text: "MU" },
      { key: "C", text: "ALU" },
      { key: "D", text: "OU" }
    ],
    answer: "C",
    explanation: "ALU（Arithmetic and Logic Unit，算術邏輯單元）負責數值加減乘除計算以及邏輯判斷（比對、配對、比較大小等）。CU 為控制單元，MU 為記憶單元，OU 為輸出單元。"
  },
  {
    id: 10,
    page: 1,
    category: "中央處理器 CPU",
    question: "MIPS為一種衡量電腦CPU之測量指標，其中I代表：",
    options: [
      { key: "A", text: "資訊(Information)" },
      { key: "B", text: "指令(Instruction)" },
      { key: "C", text: "輸入(Input)" },
      { key: "D", text: "內部(Internal)" }
    ],
    answer: "B",
    explanation: "MIPS 全名為 Million Instructions Per Second（每秒百萬條指令），是評估 CPU 運算速度的一種衡量標準，故字母 I 代表 Instruction（指令）。"
  },
  {
    id: 11,
    page: 1,
    category: "電腦五大單元",
    question: "在「星際迷航記」影集中，船長寇克領導眾船員一同探索宇宙，當遇上危機時，船長便會指派船員完成各自的工作，並引導船員們脫離險境。請問若以船長扮演的角色來看，可比喻成電腦的哪一個單元最恰當？",
    options: [
      { key: "A", text: "輸入單元" },
      { key: "B", text: "記憶單元" },
      { key: "C", text: "輸出單元" },
      { key: "D", text: "控制單元" }
    ],
    answer: "D",
    explanation: "控制單元（Control Unit, CU）如同整個系統的大腦或指揮官，負責提取指令、解碼並指揮協調所有單元分工運作，正如船長統籌指揮整艘船的運作。"
  },
  {
    id: 12,
    page: 1,
    category: "中央處理器 CPU",
    question: "志華購買了一台安插8GB記憶體的64位元電腦，下列有關該台電腦的敘述何者正確？",
    options: [
      { key: "A", text: "8GB指的是快取記憶體的容量" },
      { key: "B", text: "一般用途暫存器的位元數為8GB" },
      { key: "C", text: "CPU時脈頻率為64位元" },
      { key: "D", text: "64位元指的是一般用途暫存器的位元數" }
    ],
    answer: "D",
    explanation: "電腦常說的「64位元」，指的是 CPU 內部暫存器（Registers）與資料處理基本單位的寬度為 64 bit，能一次處理 64 位元的二進位資料；而 8GB 則是指主記憶體（RAM）容量。"
  },
  {
    id: 13,
    page: 1,
    category: "硬體效能與組裝",
    question: "高雄六龜區為了成立社區數位機會中心(digital opportunity center)，打算將原社區教室的電腦全數移轉至該中心。如果你是數位機會中心的電腦管理員，為了要提升這些電腦的執行效能，下列何者最不可能是你優先考慮要更換的設備或元件？",
    options: [
      { key: "A", text: "CPU" },
      { key: "B", text: "主記憶體" },
      { key: "C", text: "顯示卡" },
      { key: "D", text: "鍵盤" }
    ],
    answer: "D",
    explanation: "更換 CPU、增加主記憶體（RAM）容量、升級顯示卡都能顯著提升系統運算與繪圖效能；鍵盤僅為一般輸入設備，更換鍵盤並無法改善電腦的核心運算執行效能。"
  },
  {
    id: 14,
    page: 2,
    category: "電腦五大單元",
    question: "電腦的基本架構可分為五大單元，其中輸出單元(output unit)的功用為？",
    options: [
      { key: "A", text: "接收使用者所輸入的資料" },
      { key: "B", text: "執行程式和處理資料" },
      { key: "C", text: "進行算術運算與邏輯運算" },
      { key: "D", text: "將資料輸出到顯示器或儲存媒體" }
    ],
    answer: "D",
    explanation: "輸出單元（Output Unit）主要功能是將電腦處理後的結果轉換為人類可理解的形式（如螢幕、印表機、喇叭）或傳送至外部儲存裝置保存。"
  },
  {
    id: 15,
    page: 2,
    category: "中央處理器 CPU",
    question: "聯想推出搭載Intel Core i7-1165G7 2.80GHz CPU的「變形筆電」，這種筆電的螢幕可以360度翻轉，變身為平板電腦。請根據以上敘述判斷下列何者正確？",
    options: [
      { key: "A", text: "Intel為CPU的產品型號" },
      { key: "B", text: "Core i7-1165G7為CPU的製造廠商" },
      { key: "C", text: "CPU的時脈頻率為2.80GHz" },
      { key: "D", text: "石英振盪器每秒振盪2.80億次" }
    ],
    answer: "C",
    explanation: "Intel 是 CPU 製造商，Core i7-1165G7 是型號，2.80GHz 是基礎工作時脈頻率（Clock Rate）。1 GHz = 10^9 Hz（10億次/秒），所以 2.80GHz 代表每秒震盪 28 億次，故 (C) 正確。"
  },
  {
    id: 16,
    page: 2,
    category: "儲存媒體與硬碟",
    question: "有關固態硬碟(solid state disk, SSD)與傳統機械硬碟(hard disk, HDD)的敘述，下列何者正確？",
    options: [
      { key: "A", text: "HDD中的儲存元件是採用快閃記憶體" },
      { key: "B", text: "SSD採用低噪音馬達驅動讀寫頭並具抗震特點" },
      { key: "C", text: "HDD沒有旋轉及搜尋資料時間，僅須考量資料傳輸時間" },
      { key: "D", text: "SSD在經過長時間及多次使用致使內部儲存資料零散，仍不可/不須進行磁碟重組" }
    ],
    answer: "D",
    explanation: "SSD 是以快閃記憶體晶片為儲存介質，沒有機械讀寫頭與馬達，讀取各區塊速度幾乎均等，且快閃記憶體有抹寫次數壽命限制，因此 SSD「不可也不需進行傳統磁碟重組」，重組只會耗損壽命。"
  },
  {
    id: 17,
    page: 2,
    category: "記憶體架構",
    question: "為了減少對主記憶體的存取次數，以提昇電腦整體執行速度，個人電腦的快取記憶體(cache memory)通常以下列何者為材質？",
    options: [
      { key: "A", text: "DRAM" },
      { key: "B", text: "EPROM" },
      { key: "C", text: "ROM" },
      { key: "D", text: "SRAM" }
    ],
    answer: "D",
    explanation: "快取記憶體（Cache Memory）為了配合 CPU 極高的處理速度，必須具備極快的存取速率，因此都是以靜態隨機存取記憶體（SRAM）製作。"
  },
  {
    id: 18,
    page: 2,
    category: "電腦五大單元",
    question: "加、減、乘、除是程式中常需進行的算術運算，請問在電腦中負責這些運算處理的是哪一個單元？",
    options: [
      { key: "A", text: "算術邏輯單元" },
      { key: "B", text: "控制單元" },
      { key: "C", text: "輸出單元" },
      { key: "D", text: "輸入單元" }
    ],
    answer: "A",
    explanation: "算術邏輯單元（ALU）專門執行所有基本算術運算（加、減、乘、除）與邏輯運算（AND、OR、NOT、比較）。"
  },
  {
    id: 19,
    page: 2,
    category: "儲存媒體與硬碟",
    question: "民眾只要持悠遊卡在台鐵剪票口刷卡，就可以進入月台搭車，且可隨時在全家超商等處利用儲值設備進行悠遊卡的加值。請問悠遊卡可能是利用下列哪一種元件來儲存資料？",
    options: [
      { key: "A", text: "DRAM" },
      { key: "B", text: "EEPROM" },
      { key: "C", text: "PROM" },
      { key: "D", text: "HDD" }
    ],
    answer: "B",
    explanation: "悠遊卡是 RFID 晶片卡，要求斷電後資料不遺失（非揮發性），且能透過電子訊號多次抹除並寫入新金額與交易紀錄，因此使用 EEPROM（電子抹除式可程式唯讀記憶體）或快閃記憶體。"
  },
  {
    id: 20,
    page: 2,
    category: "記憶體架構",
    question: "大雄在光華數位新天地買了一部桌上型電腦，此機配備了如選項中的四種記憶或儲存裝置，請問它們中何者之存取速度最快？",
    options: [
      { key: "A", text: "快取記憶體(cache)" },
      { key: "B", text: "輔助記憶體－固態硬碟(SSD)" },
      { key: "C", text: "主記憶體(DRAM)" },
      { key: "D", text: "輔助記憶體－硬碟(HDD)" }
    ],
    answer: "A",
    explanation: "記憶體階層存取速度比較：暫存器 (Registers) > 快取記憶體 (Cache, SRAM) > 主記憶體 (DRAM) > 固態硬碟 (SSD) > 機械硬碟 (HDD)。故快取記憶體速度最快。"
  },
  {
    id: 21,
    page: 2,
    category: "儲存媒體與硬碟",
    question: "MacBook Air採用固態硬碟大幅降低機身的厚度，機身最薄處僅0.3公分，請問該筆電採用的固態硬碟與傳統硬碟，差異為何？",
    options: [
      { key: "A", text: "固態硬碟的體積較大" },
      { key: "B", text: "傳統硬碟的耐震度較佳" },
      { key: "C", text: "固態硬碟是使用快閃記憶體來作為儲存元件" },
      { key: "D", text: "傳統硬碟的儲存容量通常較小" }
    ],
    answer: "C",
    explanation: "固態硬碟（SSD）內部使用快閃記憶體（Flash Memory）晶片儲存資料，無馬達與磁頭等精密機械零件，具備體積小、重量輕、耗電低、讀寫快且極佳抗震性的特點。"
  },
  {
    id: 22,
    page: 2,
    category: "顯示器技術",
    question: "三星公司推出的某款Android智慧型手機，宣稱採用AMOLED技術，可使螢幕色彩更加鮮豔，請問此款手機的螢幕最可能是採用下列哪一種材質所製成的？",
    options: [
      { key: "A", text: "陰極射線管" },
      { key: "B", text: "液晶" },
      { key: "C", text: "有機發光二極體" },
      { key: "D", text: "電漿" }
    ],
    answer: "C",
    explanation: "AMOLED 即 Active-Matrix Organic Light-Emitting Diode（主動矩陣有機發光二極體），像素具自發光能力，不需背光源，色彩鮮明且純黑表現極佳。"
  },
  {
    id: 23,
    page: 2,
    category: "輸入與輸出 I/O",
    question: "玟芳想要自己挑選一台印表機，如果她對於列印品質的要求特別高，請問當她在購買時，應特別考量下列哪一項印表機的規格？",
    options: [
      { key: "A", text: "解析度" },
      { key: "B", text: "外殼顏色" },
      { key: "C", text: "尺寸大小" },
      { key: "D", text: "重量" }
    ],
    answer: "A",
    explanation: "印表機的「解析度」（單位為 dpi, dots per inch，每英吋點數）是決定列印精緻度與畫質的最關鍵指標，dpi 越高，列印越細膩。"
  },
  {
    id: 24,
    page: 2,
    category: "連接埠與規格",
    question: "裕書的筆記型電腦內建有Type C、HDMI、line out等連接埠，下列為他使用這些連接埠的操作，請問何者不正確？",
    options: [
      { key: "A", text: "利用line out連接埠來上網" },
      { key: "B", text: "利用Type C連接埠來為手機充電" },
      { key: "C", text: "利用Type C連接埠將手機中的資料傳送至電腦" },
      { key: "D", text: "利用HDMI連接埠將手機畫面傳送至電視播放" }
    ],
    answer: "A",
    explanation: "line out 為類比音訊輸出插孔（通常為 3.5mm 音源孔），用來連接耳機或音響外接喇叭，無法用作網路傳輸上網。有線上網應使用 RJ-45 乙太網路孔或 Type-C 轉接網卡。"
  },
  {
    id: 25,
    page: 2,
    category: "輸入與輸出 I/O",
    question: "史記：「秦始皇三十四年，丞相李斯上言儒生是古非今，反對批評朝政、法令，因此建議除了秦記、醫藥、卜筮、種樹等書外，一律燒毀」。請問，如果在秦朝即擁有現代的資訊科技，則可利用下列哪一種設備，將書籍內容數位化，以便備份起來？",
    options: [
      { key: "A", text: "印表機" },
      { key: "B", text: "QLED液晶螢幕" },
      { key: "C", text: "滑鼠" },
      { key: "D", text: "掃描器" }
    ],
    answer: "D",
    explanation: "掃描器（Scanner）能透過光學感測元件讀取紙本書籍與圖像，將實體圖文內容轉化為二進位數位影像或文字檔案儲存，達到數位化備份的目的。"
  }
];

