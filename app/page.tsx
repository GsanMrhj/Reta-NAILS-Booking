import Link from "next/link";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-gray-900 p-10 rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.15)] text-center max-w-lg w-full border-t-4 border-yellow-500">
        
        {/* قسم اللوجو */}
        <div className="mb-6 flex justify-center">
          <div className="w-32 h-32 rounded-full border-2 border-yellow-500 p-1 overflow-hidden bg-black flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <img 
              src="/logo.jpg" 
              alt="لوجو صالون ريتا" 
              className="w-full h-full object-cover rounded-full" 
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
          صالون ريتا للأظافر
        </h1>
        <p className="text-gray-400 mb-8 text-lg">أهلاً بكِ في عالم الجمال والأناقة. دليلك لأظافر مثالية يبدأ من هنا!</p>
        
        <Link 
          href="/booking" 
          className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105"
        >
          احجزي موعدك الآن
        </Link>
      </div>
    </main>
  );
}