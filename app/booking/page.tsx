// app/booking/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const servicesList = [
    "ميلوي (₪100)",
    "جيل مبنى انتومي (₪70)",
    "بولي جيل (₪100)",
    "جيل عادي (₪50)",
    "بنيا تيبيس جيل (₪120)",
    "بنيا بلدر جيل (₪150)",
    "تنظيف ضافير (₪50)",
    "جيل ضافير جريات (₪60)",
    "ضافير ديات جريات (₪150)"
  ];
  const [selectedService, setSelectedService] = useState(servicesList[0]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [showWaitingListForm, setShowWaitingListForm] = useState(false);
  const [waitingNote, setWaitingNote] = useState("");

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  async function fetchAvailableSlots() {
    const { data } = await supabase
      .from("available_slots")
      .select("*")
      .eq("is_booked", false)
      .order("date_time", { ascending: true });
    if (data) setSlots(data);
    setLoading(false);
  }

  const availableDates = Array.from(new Set(slots.map(s => s.date_time.split("T")[0])));
  const slotsForSelectedDate = slots.filter(s => s.date_time.startsWith(selectedDate));

  const formatPhoneNumber = (num: string) => {
    let cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '972' + cleanNum.substring(1);
    return cleanNum;
  };

  const handleBookingRequest = () => {
    if (!name || !phone || !selectedSlot || !selectedService) {
      alert("الرجاء تعبئة الاسم، رقم الواتساب، الخدمة، واختيار موعد!");
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    const formattedPhone = formatPhoneNumber(phone);
    const message = `مرحباً ${name}، رمز التأكيد الخاص بك لحجز موعد (${selectedService}) في صالون ريتا هو: *${code}*`;
    
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setShowOtpInput(true);
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== generatedOtp) {
      alert("❌ الرمز خاطئ، تأكد من رسالة الواتساب!");
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert([{
      customer_name: name, 
      customer_phone: phone, 
      slot_id: selectedSlot, 
      service_name: selectedService,
      status: 'confirmed'
    }]);

    if (insertError) return alert("حدث خطأ أثناء الحجز.");
    
    await supabase.from("available_slots").update({ is_booked: true }).eq("id", selectedSlot);

    alert("✅ تم تأكيد حجزك بنجاح! بانتظارك في الصالون.");
    router.push("/");
  };

  const handleJoinWaitingList = async () => {
    if (!name || !phone) {
      alert("الرجاء إدخال الاسم ورقم الواتساب للانضمام لقائمة الانتظار.");
      return;
    }

    const { error } = await supabase.from("waiting_list").insert([{
      customer_name: name,
      customer_phone: phone,
      requested_note: waitingNote || "بدون ملاحظات"
    }]);

    if (error) {
      alert("حدث خطأ، يرجى المحاولة لاحقاً.");
    } else {
      alert("✨ تم تسجيلك في قائمة الانتظار بنجاح! ستتواصل معكِ ريتا فور توفر أي شاغر.");
      router.push("/");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-bold text-xl">جاري التحميل...</div>;

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center font-sans relative">
      <div className="bg-neutral-900 p-8 rounded-3xl shadow-[0_0_40px_rgba(212,175,55,0.2)] w-full max-w-xl border-t-4 border-yellow-500 relative z-10">
        
        <div className="text-center mb-6">
          <Link href="/" className="text-yellow-400 text-sm hover:underline">← العودة للرئيسية</Link>
          <h1 className="text-3xl font-bold text-yellow-500 mt-2">🎀 احجزي موعدكِ الملكي 🎀</h1>
        </div>

        {!showOtpInput && !showWaitingListForm ? (
          <>
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">1. اختاري الخدمة المطلوبة:</label>
              <select 
                value={selectedService} 
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-4 bg-black border border-yellow-500/40 rounded-xl text-yellow-400 font-bold outline-none"
              >
                {servicesList.map((srv, idx) => (
                  <option key={idx} value={srv}>{srv}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-300 mb-3">2. اختاري اليوم المتاح:</h2>
              {availableDates.length === 0 ? (
                <div className="text-center bg-black p-4 rounded-xl border border-neutral-800">
                  <p className="text-gray-400 mb-3">لا توجد أيام متاحة حالياً في الجدول.</p>
                  <button onClick={() => setShowWaitingListForm(true)} className="text-yellow-400 font-bold underline">
                    📝 التسجيل في قائمة الانتظار (Waiting List)
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableDates.map(dateStr => (
                    <button
                      key={dateStr}
                      onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                      className={`px-4 py-2.5 rounded-xl border font-bold transition-all ${
                        selectedDate === dateStr 
                        ? "bg-yellow-500 text-black border-yellow-400 shadow-lg" 
                        : "bg-black text-gray-300 border-neutral-700 hover:border-yellow-500"
                      }`}
                    >
                      {new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-yellow-400 mb-2">الأوقات المتاحة ليوم {selectedDate}:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {slotsForSelectedDate.map(slot => {
                    const timeStr = new Date(slot.date_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedSlot === slot.id ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold" : "bg-black border-neutral-800 text-gray-300"
                        }`}
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-300">3. معلومات التواصل:</h2>
              <input 
                type="text" placeholder="اسمك الكريم..." value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full p-3.5 bg-black border border-neutral-700 rounded-xl text-white outline-none focus:border-yellow-500"
              />
              <input 
                type="tel" placeholder="رقم الواتساب (مثال: 0556860522)" value={phone} onChange={(e) => setPhone(e.target.value)} 
                className="w-full p-3.5 bg-black border border-neutral-700 rounded-xl text-white outline-none focus:border-yellow-500"
              />
            </div>

            <button 
              onClick={handleBookingRequest} 
              disabled={!selectedSlot} 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 disabled:from-neutral-800 disabled:text-neutral-500 text-black font-extrabold py-4 rounded-xl shadow-lg text-lg"
            >
              إرسال رمز التأكيد عبر الواتساب 💬
            </button>

            <div className="mt-4 text-center">
              <button onClick={() => setShowWaitingListForm(true)} className="text-sm text-gray-400 hover:text-yellow-400 underline">
                لا توجد ساعة مناسبة؟ انضمي لقائمة الانتظار 📋
              </button>
            </div>
          </>
        ) : showWaitingListForm ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">قائمة الانتظار 📋</h2>
            <p className="text-gray-400 text-sm mb-6">سجلي بياناتك وسنتواصل معكِ فور توفر أي موعد جديد.</p>
            <div className="space-y-3 mb-6">
              <input type="text" placeholder="اسمك الكريم..." value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 bg-black border rounded-xl text-white"/>
              <input type="tel" placeholder="رقم الواتساب..." value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3.5 bg-black border rounded-xl text-white"/>
              <input type="text" placeholder="ملاحظة أو الوقت المفضل (اختياري)..." value={waitingNote} onChange={(e) => setWaitingNote(e.target.value)} className="w-full p-3.5 bg-black border rounded-xl text-white"/>
            </div>
            <button onClick={handleJoinWaitingList} className="w-full bg-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg">
              تسجيل في قائمة الانتظار ✨
            </button>
            <button onClick={() => setShowWaitingListForm(false)} className="mt-4 text-sm text-gray-400 underline">العودة للحجز العادي</button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">أكّدي رمز الواتساب 💬</h2>
            <p className="text-gray-400 mb-6">أدخلي الرمز المكون من 4 أرقام المرسل إلى واتسابك:</p>
            <input 
              type="text" maxLength={4} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} 
              className="w-full p-4 mb-6 bg-black border-2 border-yellow-500 rounded-xl text-center text-3xl tracking-widest font-bold text-white outline-none"
            />
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg">
              تأكيد الحجز النهائي ✅
            </button>
            <button onClick={() => setShowOtpInput(false)} className="w-full mt-4 text-gray-400 underline">تعديل البيانات</button>
          </div>
        )}
      </div>
    </main>
  );
}