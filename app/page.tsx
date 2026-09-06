"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setGalleryImages(data);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans">
      
      {/* خلفية غنية ومليئة بالإيموجيز واللمعات الفخمة المتنوعة */}
      <div className="absolute inset-0 opacity-35 pointer-events-none overflow-hidden select-none text-2xl sm:text-3xl">
        <span className="absolute top-[3%] left-[5%] animate-bounce">🎀</span>
        <span className="absolute top-[8%] left-[25%] animate-pulse">✨</span>
        <span className="absolute top-[5%] right-[10%] animate-bounce text-4xl">💅</span>
        <span className="absolute top-[15%] right-[32%] animate-spin">💎</span>
        <span className="absolute top-[22%] left-[12%] animate-pulse text-4xl">💖</span>
        <span className="absolute top-[28%] right-[8%] animate-bounce text-3xl">👑</span>
        <span className="absolute top-[35%] left-[20%] animate-spin">✨</span>
        <span className="absolute top-[42%] right-[18%] animate-bounce text-4xl">🎀</span>
        <span className="absolute top-[50%] left-[6%] animate-pulse text-4xl">💅</span>
        <span className="absolute top-[58%] right-[12%] animate-spin">✨</span>
        <span className="absolute top-[65%] left-[22%] animate-bounce text-4xl">💖</span>
        <span className="absolute top-[72%] right-[28%] animate-pulse">💎</span>
        <span className="absolute top-[80%] left-[15%] animate-bounce text-3xl">👑</span>
        <span className="absolute top-[88%] right-[10%] animate-spin text-4xl">🎀</span>
        <span className="absolute top-[95%] left-[30%] animate-pulse">💅</span>
        
        {/* الجانب الأيسر والأوسط إضافات مكثفة */}
        <span className="absolute top-[12%] left-[45%] animate-pulse">💖</span>
        <span className="absolute top-[25%] left-[55%] animate-bounce">🎀</span>
        <span className="absolute top-[40%] left-[48%] animate-spin">✨</span>
        <span className="absolute top-[60%] left-[52%] animate-bounce text-4xl">💅</span>
        <span className="absolute top-[82%] left-[48%] animate-pulse">💎</span>
        <span className="absolute top-[92%] left-[60%] animate-bounce">👑</span>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 max-w-xl w-full mx-auto my-12 bg-neutral-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.25)] text-center border border-yellow-500/40">
        
        <div className="flex justify-center items-center gap-2 mb-4 text-yellow-400 text-sm tracking-widest uppercase">
          <span>✨</span> 🎀 Luxury Nail Art 🎀 <span>✨</span>
        </div>

        {/* اللوجو */}
        <div className="mb-6 flex justify-center">
          <div className="w-36 h-36 rounded-full border-2 border-yellow-500 p-1 bg-black flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.5)]">
            <img src="/logo.jpg" alt="Reta Nails" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        {/* اسم الصالون بخط متحرك */}
        <h1 className="text-5xl sm:text-6xl font-black tracking-wider mb-3 uppercase font-serif" style={{
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
          أنوثة، فخامة، وعناية ملكية تليق بأظافركِ. احجزي موعدكِ وتألقي الآن.
        </p>
        
        {/* أزرار التنقل */}
        <div className="space-y-3">
          <Link 
            href="/booking" 
            className="inline-block w-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-400 text-black font-extrabold text-xl py-4 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02]"
          >
            🎀 احجزي موعدكِ الآن 🎀
          </Link>
          
          <Link 
            href="/services" 
            className="inline-block w-full bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/40 font-bold text-lg py-3 px-8 rounded-2xl transition-all"
          >
            📋 قائمة الخدمات والأسعار
          </Link>
        </div>
      </div>

      {/* معرض أعمال ريتا (Gallery) */}
      <div className="relative z-10 max-w-4xl w-full mx-auto mt-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8 font-serif">📸 معرض أعمال ريتا الملكية</h2>
        {galleryImages.length === 0 ? (
          <p className="text-gray-500 text-center">قريباً سيتم إضافة أحدث صور شغل الأظافر هنا ✨</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((item) => (
              <div key={item.id} className="bg-neutral-900 border border-yellow-500/30 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <img src={item.image_url} alt="Nail Work" className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* أزرار التواصل الثابتة */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a 
          href="https://wa.me/972556860522" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 text-2xl"
          title="تواصل عبر الواتساب"
        >
          💬
        </a>
        <a 
          href="https://instagram.com/retanails" 
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