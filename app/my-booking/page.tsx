"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MyBookingPage() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (num: string) => {
    let cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '972' + cleanNum.substring(1);
    return cleanNum;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return alert("الرجاء إدخال رقم الواتساب!");

    setLoading(true);
    const cleanPhone = formatPhoneNumber(phone);

    const { data: dataBookings } = await supabase
      .from("bookings")
      .select("*, available_slots(id, date_time)")
      .or(`customer_phone.eq.${phone},customer_phone.eq.${cleanPhone}`);

    setBookings(dataBookings || []);
    setSearched(true);
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId: string, slotId: string) => {
    if (!confirm("هل أنت متأكدة من رغبتك في إلغاء هذا الموعد؟ سيتم إتاحته في النظام فوراً.")) return;

    // 1. حذف الحجز من الجدول
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (deleteError) {
      alert("حدث خطأ أثناء إلغاء الموعد.");
      return;
    }

    // 2. إعادة إتاحة الدور في الجدول (is_booked = false)
    if (slotId) {
      await supabase
        .from("available_slots")
        .update({ is_booked: false })
        .eq("id", slotId);
    }

    alert("✅ تم إلغاء الموعد بنجاح، وأصبح الدور متاحاً الآن.");
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans relative">
      <div className="bg-neutral-900 p-8 rounded-3xl shadow-[0_0_40px_rgba(212,175,55,0.2)] w-full max-w-xl border-t-4 border-yellow-500 relative z-10">
        
        <div className="text-center mb-6">
          <Link href="/" className="text-yellow-400 text-sm hover:underline">← العودة للرئيسية</Link>
          <h1 className="text-3xl font-bold text-yellow-500 mt-2">📅 مَوْعِدي</h1>
          <p className="text-gray-400 text-sm mt-1">أدخلي رقم واتسابك للاستعلام عن موعدك أو إلغائه.</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <input 
            type="tel" 
            placeholder="رقم الواتساب (مثال: 0556860522)..." 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full p-3.5 bg-black border border-neutral-700 rounded-xl text-white outline-none focus:border-yellow-500 text-center text-lg"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-3.5 rounded-xl shadow-lg transition-all"
          >
            {loading ? "جاري البحث... ⏳" : "بحث عن مواعيدي 🔍"}
          </button>
        </form>

        {searched && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-black border border-neutral-800 p-6 rounded-2xl text-center">
                <p className="text-3xl mb-2">🌸</p>
                <p className="text-yellow-400 font-bold text-lg mb-1">ليس لديك حجوزات نشطة</p>
                <p className="text-gray-400 text-sm">لا توجد أي مواعيد مسجلة بهذا الرقم حالياً.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold text-yellow-400 mb-3">حجوزاتك الحالية:</h2>
                <div className="space-y-3">
                  {bookings.map(b => {
                    const slotTime = b.available_slots?.date_time || "";
                    const datePart = slotTime.split('T')[0] || "";
                    const timePart = slotTime.split('T')[1]?.substring(0, 5) || "";

                    return (
                      <div key={b.id} className="bg-black border border-yellow-500/40 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-gray-400 text-xs block mb-1">اسم الزبونة:</span>
                            <p className="font-bold text-white text-lg">{b.customer_name}</p>
                          </div>
                          <span className="bg-yellow-500 text-black text-xs font-extrabold px-3 py-1 rounded-full">مؤكد ✅</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs block">التاريخ والوقت:</span>
                            <span className="font-bold text-white" dir="ltr">{datePart} {timePart}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs block">الخدمة المختارة:</span>
                            <span className="font-bold text-yellow-400">{b.service_name}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleCancelBooking(b.id, b.slot_id)}
                          className="w-full bg-red-950 hover:bg-red-900 text-red-400 font-bold py-2.5 rounded-xl border border-red-500/30 text-sm transition-all"
                        >
                          إلغاء الموعد وإتاحته للآخرين ❌
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}