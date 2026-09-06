"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// تهيئة الاتصال بقاعدة البيانات باستخدام المفاتيح التي رفعناها لـ Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // حالات واجهة المستخدم
  const [loading, setLoading] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // جلب الأوقات المتاحة من قاعدة البيانات عند فتح الصفحة
  useEffect(() => {
    async function fetchSlots() {
      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("is_booked", false) // جلب الأوقات غير المحجوزة فقط
        .order("date_time", { ascending: true });

      if (data) setSlots(data);
      setLoading(false);
    }
    fetchSlots();
  }, []);

  // دالة طلب الحجز (إرسال البيانات لـ Supabase وتجهيز الواتساب)
  const handleBookingRequest = async () => {
    if (!name || !phone || !selectedSlot) {
      alert("الرجاء تعبئة جميع البيانات واختيار وقت!");
      return;
    }

    // هنا سيتم لاحقاً دمج كود إرسال الواتساب
    // حالياً ننتقل لشاشة إدخال الرمز السري
    setShowOtpInput(true);
  };

  // دالة تأكيد الرمز السري
  const handleVerifyOtp = async () => {
    if (otpCode.length < 4) {
      alert("الرجاء إدخال الرمز الصحيح");
      return;
    }
    alert("تم تأكيد الحجز بنجاح! سيتم إضافته للوحة تحكم ريتا.");
    // سيتم تحديث حالة الجدول إلى محجوز في الخطوة القادمة
    setShowOtpInput(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-600 text-xl font-bold">جاري تحميل الأوقات المتاحة...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-pink-50 p-6 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-xl border-t-8 border-pink-400">
        <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">احجزي موعدك 💅</h1>
        
        {!showOtpInput ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">1. اختاري الوقت المناسب:</h2>
              {slots.length === 0 ? (
                <p className="text-gray-500 bg-gray-100 p-4 rounded-xl text-center">عذراً، لا يوجد أوقات متاحة حالياً. يرجى المحاولة لاحقاً.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((slot) => {
                    const dateObj = new Date(slot.date_time);
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedSlot === slot.id 
                            ? "border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-md" 
                            : "border-gray-200 text-gray-600 hover:border-pink-300"
                        }`}
                      >
                        <div className="text-lg">{dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-sm text-gray-500">{dateObj.toLocaleDateString('ar-EG', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">2. معلوماتك لتأكيد الحجز:</h2>
              <input 
                type="text" placeholder="الاسم الكريم" 
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-right"
              />
              <input 
                type="tel" placeholder="رقم الواتساب (مثال: 05xxxxxxx)" 
                value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-right"
              />
            </div>

            <button 
              onClick={handleBookingRequest}
              disabled={!selectedSlot}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold text-xl py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              تأكيد الموعد
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تأكيد رقم الواتساب 💬</h2>
            <p className="text-gray-600 mb-6">أرسلنا رمز تأكيد للرقم {phone}</p>
            <input 
              type="text" placeholder="أدخلي الرمز هنا" maxLength={4}
              value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-center text-2xl tracking-widest font-bold"
            />
            <button 
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 rounded-xl transition-all shadow-lg"
            >
              تأكيد الحجز النهائي
            </button>
            <button 
              onClick={() => setShowOtpInput(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 underline"
            >
              تعديل الرقم أو الوقت
            </button>
          </div>
        )}
      </div>
    </main>
  );
}