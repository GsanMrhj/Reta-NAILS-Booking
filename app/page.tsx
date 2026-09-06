import Link from "next/link";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* خلفية جمالية متحركة خفيفة (إضاءات ذهبية خافتة بالخلفية) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 bg-neutral-900/80 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.2)] text-center max-w-xl w-full border border-yellow-500/30">
        
        {/* اللوجو */}
        <div className="mb-6 flex justify-center">
          <div className="w-36 h-36 rounded-full border-2 border-yellow-500 p-1 bg-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            <img src="/logo.jpg" alt="Reta Nails" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {/* اسم الصالون بخط ضخم وتأثير ذهبي متحرك */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-wider mb-4 uppercase font-serif" style={{
          background: 'linear-gradient(90deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
          backgroundSize: '200% auto',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          animation: 'shimmer 4s linear infinite'
        }}>
          Reta Nails
        </h1>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <p className="text-gray-300 mb-8 text-lg font-light">
          فن العناية بالأظافر والجمال الملكي. احجزي موعدك وتألقي بإطلالة فريدة.
        </p>
        
        {/* زر الحجز */}
        <Link 
          href="/booking" 
          className="inline-block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-400 text-black font-extrabold text-xl py-4 px-8 rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02]"
        >
          ✨ احجزي موعدك الآن ✨
        </Link>
      </div>

      {/* أزرار التواصل الثابتة (واتساب وانستجرام) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* زر الواتساب */}
        <a 
          href="https://wa.me/+972556860522" // استبدل الرقم برقم ريتا الحقيقي مع الرمز الدولي
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 text-2xl"
          title="تواصل عبر الواتساب"
        >
          💬
        </a>
        {/* زر الانستجرام */}
        <a 
          href="https://instagram.com/reta.nails.1" // استبدل الرابط برابط حساب ريتا
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 hover:opacity-90 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 text-2xl"
          title="حساب الانستجرام"
        >
          📸
        </a>
      </div>
    </main>
  );
}