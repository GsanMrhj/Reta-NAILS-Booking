import Link from "next/link";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border-t-8 border-pink-400 hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-6 flex justify-center">
          <span className="text-6xl">💅</span>
        </div>
        <h1 className="text-4xl font-bold text-pink-600 mb-4">صالون ريتا للأظافر</h1>
        <p className="text-gray-600 mb-8 text-lg">أهلاً بكِ في عالم الجمال والأناقة. دليلك لأظافر مثالية يبدأ من هنا!</p>
        
        {/* هنا حولنا الزر العادي إلى رابط ينقل لصفحة الحجز */}
        <Link 
          href="/booking" 
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 shadow-md hover:scale-105"
        >
          احجزي موعدك الآن
        </Link>
      </div>
    </main>
  );
}