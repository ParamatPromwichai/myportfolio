// lib/data.ts
export const skills = [
  { category: "Frontend", items: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"] },
  { category: "Backend & API", items: ["Node.js", "PHP", "Python"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL", "TiDB", "Supabase", "MongoDB"] },
  { category: "Cloud & DevOps", items: ["Git", "GitHub", "Vercel", "Railway", "Render", "VPS Deployment"] },
  { category: "Tools", items: ["VS Code", "Visual Studio", "DBeaver", "XAMPP", "Arduino IO Simulator", "Postman", "Antigravity"] },
  { category: "Additional Skills", items: ["Flutter", "Dart", "C#", "Arduino (ESP32/8266)", "IoT Sensors", "AI Chatbot Integration", "Pandas", "Matplotlib"] },
];

export const projects = [
  {
    id: "smartdine",
    title: "SMARTDINE MANAGER (Senior Project)[กำลังพัฒนามีลิงก์เว็บไซต์ตัวอย่าง]",
    year: "ปัจจุบัน",
    description: "พัฒนา Web App ระบบจัดการร้านอาหารแบบครบวงจร (Senior Project) พร้อมบูรณาการ AI Chatbot ตอบคำถามลูกค้าอัตโนมัติ ",
    fullDescription: "ระบบจัดการร้านอาหารแบบ Full-Stack ที่ออกแบบมาเพื่อลดขั้นตอนการทำงานของพนักงานและผู้จัดการร้าน รองรับฟีเจอร์การจัดการคิว สั่งอาหารผ่าน QR Code และการติดตามสถานะออเดอร์แบบเรียลไทม์ จุดเด่นคือการนำ AI Chatbot มาประยุกต์ใช้เพื่อตอบคำถามลูกค้าเบื้องต้น และให้คำแนะนำเมนูอาหารได้อย่างชาญฉลาด",
    techStack: ["Next.js", "TypeScript", "Flask", "MySQL"],
    image: "/image/smartdine-manager.jpg",
    additionalImages: [],
    video: "/video/smartdine-manager.mp4",
    websiteUrl: "https://dinemanager.vercel.app" // เปลี่ยนเป็นลิงก์เว็บไซต์จริงของคุณ
  },
  {
    id: "smartrain",
    title: "SMART RAIN GROW",
    year: "2567",
    description: "พัฒนา Mobile App สั่งการระบบรดน้ำต้นไม้อัตโนมัติ พร้อมแสดงผลค่าความชื้นและสภาพอากาศ",
    fullDescription: "แอปพลิเคชันบนมือถือที่เชื่อมต่อกับระบบเซนเซอร์ IoT ภายในแปลงเกษตรเพื่อตรวจวัดความชื้นในดินและสภาพอากาศ ผู้ใช้สามารถสั่งการเปิด-ปิดระบบรดน้ำผ่านมือถือได้ทุกที่ทุกเวลา หรือตั้งค่าให้ระบบรดน้ำทำงานอัตโนมัติตามเกณฑ์ความชื้นที่กำหนดไว้",
    techStack: ["Flutter", "IoT Sensors"],
    image: "/image/smart-rain-grow.jpg",
    additionalImages: [],
    video: "/video/smartraingrow.mp4"
  },
  {
    id: "kaykong",
    title: "KAYKONG",
    year: "2567",
    description: "พัฒนาเว็บไซต์ E-Commerce แพลตฟอร์มแบบ Full-Stack รองรับระบบจัดการสินค้าสำหรับผู้ซื้อและผู้ขาย",
    fullDescription: "แพลตฟอร์มซื้อขายสินค้าออนไลน์ที่ถูกพัฒนาขึ้นเพื่อสนับสนุนธุรกิจรายย่อย มีระบบสำหรับทั้งฝั่งผู้ซื้อ (การค้นหาสินค้า, ตะกร้าสินค้า, ระบบชำระเงิน) และฝั่งผู้ขาย (การเพิ่ม-ลดสต๊อกสินค้า, ดูรายงานยอดขายรายวัน)",
    techStack: ["PHP", "MySQL"],
    image: "/image/kaykong.png",
    additionalImages: []
  },
  {
    id: "wrongandwin",
    title: "WRONG AND WIN",
    year: "2567",
    description: "พัฒนาแอปพลิเคชันเกมตอบคำถาม (Reverse Quiz) บน Desktop พร้อมระบบเก็บบันทึกคะแนนผู้เล่น",
    fullDescription: "โปรเจกต์เกมแนวทายคำถามที่มีกติกาแปลกใหม่ 'ตอบผิดคือถูก ตอบถูกคือผิด' (Reverse Quiz) สร้างความท้าทายให้กับผู้เล่น ตัวเกมพัฒนาขึ้นเพื่อเล่นบน PC มีระบบการจับเวลา ระบบเก็บคะแนนสูงสุด (Leaderboard) และการเชื่อมต่อฐานข้อมูล MySQL",
    techStack: ["C#", "MySQL"],
    image: "/image/wrongandwin.png",
    additionalImages: [],
    video: "/video/wrongandwin.mp4"
  },
  {
    id: "nextbin",
    title: "NEXTBIN",
    year: "2566",
    description: "พัฒนาระบบถังขยะอัจฉริยะเปิด-ปิดอัตโนมัติ พร้อมระบบบันทึกสถิติการใช้งาน ลง Google Sheets",
    fullDescription: "ถังขยะอัจฉริยะที่ใช้เซนเซอร์อัลตราโซนิกในการตรวจจับการเข้าใกล้เพื่อเปิด-ปิดฝาถังขยะอัตโนมัติ ลดการสัมผัสเชื้อโรค นอกจากนี้ยังมีการส่งข้อมูลพฤติกรรมการทิ้งขยะและปริมาณความจุไปเก็บสถิติลง Google Sheets ผ่าน API",
    techStack: ["IoT", "Google Sheets API", "API Integration"],
    image: "/image/nextbin.jpg",
    additionalImages: [],
    video: "https://www.youtube.com/watch?v=Ii0xwpEhaQM" // เปลี่ยน YOUR_VIDEO_ID_HERE เป็นไอดีวิดีโอ YouTube ของคุณ
  }
];

export const certificates = [
  { title: "Introduction to Python", issuer: "Datacamp", date: "2025", image: "/image/Pythondatacamp.jpg" },
  { title: "Intermediate Python", issuer: "Datacamp", date: "2025", image: "/image/pythonmediumdatacamp.jpg" },
  { title: "Understanding Data Visualization", issuer: "Datacamp", date: "2025", image: "/image/visualizationdatacamp.jpg" },
  { title: "Overview of Data Visualization", issuer: "Cursera", date: "2025", image: "/image/Coursera visualization.jpg" }
];
