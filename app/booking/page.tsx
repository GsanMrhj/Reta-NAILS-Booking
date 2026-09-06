"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    async function fetchSlots() {
      const { data } = await supabase
        .from("available_slots")
        .select("*")
        .eq("is_booked", false)
        .order("date_time", { ascending: true });
      if (data) setSlots(data);
      setLoading(false);
    }
    fetchSlots();
  }, []);

  const handleBookingRequest = async () => {
    if (!name || !phone || !selectedSlot) {
      alert("الرجاء تعبئة الاسم والرقم واختيار موعد!");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    alert(`📱 (رسالة SMS)\nرمز التأكيد: ${code}`);
    setShowOtpInput(true);
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== generatedOtp) {
      alert("❌ الرمز خاطئ، الرجاء المحاولة مرة أخرى!");
      return;
    }
    const { error: insertError } = await supabase.from("bookings").insert([{
      customer_name: name, customer_phone: phone, slot_id: selectedSlot, status: 'confirmed'
    }]);
    if (insertError) return alert("حدث خطأ أثناء الحجز.");
    
    await supabase.from("available_slots").update({ is_booked: true }).eq("id", selectedSlot);
    alert("✅ تم تأكيد حجزك بنجاح!");
    router.push("/");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-bold text-xl">جاري تحميل الأوقات...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-black p-6 flex flex-col items-center justify-center font-sans">
      <div className="bg-gray-900 p-8 rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.1)] w-full max-w-xl border-t-4 border-yellow-500">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8 text-center">احجزي موعدك 💅</h1>
        
        {!showOtpInput ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-300 mb-4">1. اختاري الوقت المناسب:</h2>
              {slots.length === 0 ? (
                <p className="text-gray-400 bg-gray-800 p-4 rounded-xl text-center border border-gray-700">لا يوجد أوقات متاحة حالياً.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slots.map((slot) => {
                    const dateObj = new Date(slot.date_time);
                    return (
                      <button
                        key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 rounded-xl border transition-all ${
                          selectedSlot === slot.id 
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]" 
                          : "border-gray-700 text-gray-400 hover:border-yellow-500/50 bg-gray-800"
                        }`}
                      >
                        <div className="text-lg">{dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-sm">{dateObj.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-300 mb-2">2. معلوماتك لتأكيد الحجز:</h2>
              <div>
                <label className="block text-gray-400 text-sm mb-2">الاسم الكريم:</label>
                <input 
                  type="text" placeholder="اكتبي اسمك هنا..." value={name} onChange={(e) => setName(e.target.value)} 
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500 text-right"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">رقم الهاتف (الواتساب):</label>
                <input 
                  type="tel" placeholder="مثال: 05xxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} 
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500 text-white placeholder-gray-500 text-right text-left-dir"
                />
              </div>
            </div>

            <button 
              onClick={handleBookingRequest} disabled={!selectedSlot} 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-black font-bold py-4 rounded-xl transition-all shadow-lg text-lg"
            >
              تأكيد الموعد
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">تأكيد رقم الهاتف 💬</h2>
            <p className="text-gray-400 mb-6">الرجاء إدخال الرمز المكون من 4 أرقام الذي ظهر لك.</p>
            <input 
              type="text" placeholder="----" maxLength={4} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} 
              className="w-full p-4 mb-6 bg-gray-800 border-2 border-gray-700 focus:border-yellow-500 rounded-xl text-center text-3xl tracking-widest font-bold text-white placeholder-gray-600 outline-none"
            />
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg text-lg">
              تأكيد الحجز النهائي
            </button>
            <button onClick={() => setShowOtpInput(false)} className="w-full mt-4 text-gray-400 hover:text-yellow-500 underline">
              تعديل الرقم أو الوقت
            </button>
          </div>
        )}
      </div>
    </main>
  );
}