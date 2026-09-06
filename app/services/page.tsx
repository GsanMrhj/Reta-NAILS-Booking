"use client";
import Link from "next/link";

export default function ServicesPage() {
  const servicesList = [
    { name: "ميلوي", price: "₪100", desc: "صيانة وتعبئة الأظافر (Refill) للحفاظ على مظهرها." },
    { name: "جيل مبنى انتومي", price: "₪70", desc: "بناء جيل بتصميم متناسق واحترافي." },
    { name: "بولي جيل", price: "₪100", desc: "تقوية وبناء الأظافر بمادة البولي جيل المتينة." },
    { name: "جيل عادي", price: "₪50", desc: "تطبيق لكر جيل كلاسيكي وأنيق." },
    { name: "بنيا تيبيس جيل", price: "₪120", desc: "تركيب أظافر تيبيس جيل الثابت والفاخر." },
    { name: "بنيا بلدر جيل", price: "₪150", desc: "بناء بلدر جيل متين لطول وثبات يدوم طويلاً." },
    { name: "تنظيف ضافير", price: "₪50", desc: "عناية وتنظيف كامل للأظافر وإزالة الجلد الميت." },
    { name: "جيل ضافير جريات", price: "₪60", desc: "خدمة جيل خاصة للأظافر." },
    { name: "ضافير ديات جريات", price: "₪150", desc: "طقم أظافر متكامل وفخم." },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 sm:p-12 relative overflow-hidden font-sans">
      
      {/* خلفية جمالية خافتة */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* زر العودة للصفحة الرئيسية */}
        <div className="mb-6">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center gap-2">
            ← العودة للرئيسية
          </Link>
        </div>

        {/* عنوان الصفحة */}
        <div className="text-center mb-12">
          <div className="text-yellow-400 text-sm tracking-widest uppercase mb-2">✨ Reta Nails Menu ✨</div>
          <h1 className="text-4xl sm:text-5xl font-black font-serif uppercase" style={{
            background: 'linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
            backgroundSize: '200% auto',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
          }}>
            مفتاح أسعار الأظافر
          </h1>
          <p className="text-gray-400 mt-3">دللي أظافركِ بأرقى الخدمات المصممة خصيصاً لأناقتكِ.</p>
        </div>

        {/* بطاقات الخدمات والأسعار */}
        <div className="space-y-4 mb-10">
          {servicesList.map((service, index) => (
            <div key={index} className="bg-neutral-900/90 border border-yellow-500/20 p-6 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.05)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-yellow-500/50 transition-all">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-1 flex items-center gap-2">
                  <span>💅</span> {service.name}
                </h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </div>
              <div className="text-2xl font-extrabold text-white bg-black px-4 py-2 rounded-xl border border-yellow-500/30 whitespace-nowrap">
                {service.price}
              </div>
            </div>
          ))}
        </div>

        {/* زر الانتقال للحجز */}
        <div className="text-center">
          <Link 
            href="/booking" 
            className="inline-block w-full sm:w-auto bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-extrabold text-lg py-4 px-12 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
          >
            🎀 احجزي موعدكِ الآن 🎀
          </Link>
        </div>

      </div>
    </main>
  );
}