"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [selectedDaySlots, setSelectedDaySlots] = useState<any[]>([]);
  
  const [newTime, setNewTime] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchSlots();
      fetchWaitingList();
      fetchGallery();
    }
  }, [isAuthenticated]);

  async function fetchSlots() {
    const { data } = await supabase
      .from("available_slots")
      .select(`id, date_time, is_booked, bookings ( customer_name, customer_phone, service_name )`)
      .order("date_time", { ascending: true });
    if (data) {
      setSlots(data);
      if (selectedDateStr) {
        setSelectedDaySlots(data.filter(s => s.date_time.startsWith(selectedDateStr)));
      }
    }
  }

  async function fetchWaitingList() {
    const { data } = await supabase.from("waiting_list").select("*").order("created_at", { ascending: false });
    if (data) setWaitingList(data);
  }

  async function fetchGallery() {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setGallery(data);
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDayClick = (day: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    
    setSelectedDateStr(dateStr);
    setSelectedDaySlots(slots.filter(s => s.date_time.startsWith(dateStr)));
  };

  // إضافة دور جديد لهذا اليوم المحدد
  async function handleAddSlotForDay() {
    if (!selectedDateStr || !newTime) return alert("الرجاء اختيار اليوم من التقويم وإدخال الوقت!");
    const dateTimeString = `${selectedDateStr}T${newTime}:00`;
    
    const { error } = await supabase.from("available_slots").insert([{ date_time: dateTimeString }]);
    if (!error) {
      setNewTime("");
      fetchSlots();
      alert("✨ تمت إضافة الدور بنجاح!");
    } else {
      alert("حدث خطأ أثناء الإضافة.");
    }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("هل أنت متأكدة من حذف هذا الدور؟")) return;
    await supabase.from("available_slots").delete().eq("id", id);
    fetchSlots();
  }

  async function handleGenerateMonthSlots() {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const times = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"];
    
    let newSlotsArray = [];
    for (let day = 1; day <= totalDays; day++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;

      for (const t of times) {
        newSlotsArray.push({ date_time: `${dateStr}T${t}:00`, is_booked: false });
      }
    }

    const { error } = await supabase.from("available_slots").insert(newSlotsArray);
    if (!error) {
      alert("✨ تم توليد مواعيد الشهر بالكامل بنجاح!");
      fetchSlots();
    }
  }

  async function handleAddGalleryImage() {
    if (!newImgUrl) return alert("الرجاء إدخال رابط الصورة");
    const { error } = await supabase.from("gallery").insert([{ image_url: newImgUrl }]);
    if (!error) { setNewImgUrl(""); fetchGallery(); alert("تمت إضافة الصورة بنجاح!"); }
  }

  async function handleDeleteGallery(id: string) {
    await supabase.from("gallery").delete().eq("id", id);
    fetchGallery();
  }

  async function handleDeleteWaiting(id: string) {
    await supabase.from("waiting_list").delete().eq("id", id);
    fetchWaitingList();
  }

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-neutral-900 border-2 border-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2">لوحة تحكم ريتا 👑</h1>
          <p className="text-gray-400 mb-6 text-sm">أدخل كلمة المرور</p>
          <input 
            type="password" placeholder="كلمة السر..." value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-black border-2 border-white rounded-xl mb-4 text-center text-white outline-none"
          />
          <button 
            onClick={() => { if (password === "reta2026") setIsAuthenticated(true); else alert("خطأ!"); }} 
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200"
          >
            دخول
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
        
        <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">لوحة تحكم ريتا ⚡</h1>
          <button onClick={() => setIsAuthenticated(false)} className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm">خروج</button>
        </div>
        
        {/* زر التوليد التلقائي لشهر كامل */}
        <div className="bg-neutral-800 border border-white/40 p-6 rounded-xl mb-8 text-center">
          <h2 className="text-lg font-bold mb-2 text-white">✨ توليد مواعيد الشهر تلقائياً</h2>
          <p className="text-gray-300 text-sm mb-4">إنشاء مواعيد لكل أيام الشهر الحالي من الساعة 10:00 صباحاً حتى 8:30 مساءً.</p>
          <button onClick={handleGenerateMonthSlots} className="bg-white text-black font-bold px-6 py-3 rounded-xl shadow-md hover:bg-gray-200">
            توليد جدول الشهر بالكامل 🚀
          </button>
        </div>

        {/* تقويم ريتا التفاعلي */}
        <div className="bg-black p-6 rounded-2xl border border-neutral-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDateStr(null); }} className="text-white px-3 py-1 bg-neutral-900 rounded-lg">‹</button>
            <h2 className="text-lg font-bold text-white">{monthNamesEn[month]} {year}</h2>
            <button onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDateStr(null); }} className="text-white px-3 py-1 bg-neutral-900 rounded-lg">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2 font-bold">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const day = i + 1;
              const mStr = String(month + 1).padStart(2, '0');
              const dStr = String(day).padStart(2, '0');
              const dFull = `${year}-${mStr}-${dStr}`;
              const isSelected = selectedDateStr === dFull;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`h-12 rounded-xl font-bold transition-all text-sm flex flex-col items-center justify-center ${
                    isSelected 
                    ? "bg-white text-black shadow-lg scale-105" 
                    : "bg-neutral-900 text-white border border-neutral-800 hover:border-white"
                  }`}
                >
                  <span>{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* إدارة أدوار اليوم المختار */}
        {selectedDateStr && (
          <div className="bg-black border border-white/30 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">إدارة أدوار يوم: <span className="text-yellow-400">{selectedDateStr}</span></h2>
            
            <div className="flex gap-3 mb-6">
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white" />
              <button onClick={handleAddSlotForDay} className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200">＋ إضافة دور جديد لهذا اليوم</button>
            </div>

            <div className="space-y-3">
              {selectedDaySlots.length === 0 ? (
                <p className="text-gray-400 text-sm">لا توجد أدوار مضافة في هذا اليوم.</p>
              ) : (
                selectedDaySlots.map(slot => {
                  const timeStr = new Date(slot.date_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                  return (
                    <div key={slot.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg text-white">{timeStr}</span>
                          {slot.is_booked ? <span className="bg-white text-black font-extrabold text-xs px-2.5 py-1 rounded">محجوز 🔒</span> : <span className="bg-neutral-800 text-gray-300 text-xs px-2.5 py-1 rounded">متاح ✅</span>}
                        </div>
                        <button onClick={() => handleDeleteSlot(slot.id)} className="bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg font-bold">إلغاء / حذف الدور</button>
                      </div>

                      {slot.is_booked && slot.bookings && slot.bookings.length > 0 && (
                        <div className="bg-black border border-neutral-800 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <div><span className="text-gray-500 text-xs">الزبونة:</span> <p className="font-bold text-white">{slot.bookings[0].customer_name}</p></div>
                          <div><span className="text-gray-500 text-xs">الواتساب:</span> <p className="font-bold text-white" dir="ltr">{slot.bookings[0].customer_phone}</p></div>
                          <div><span className="text-gray-500 text-xs">الخدمة:</span> <p className="font-bold text-yellow-400">{slot.bookings[0].service_name}</p></div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* إدارة صور المعرض */}
        <div className="bg-black border border-neutral-800 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold mb-4">📸 إدارة معرض الأعمال</h2>
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="رابط الصورة (Image URL)..." value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm" />
            <button onClick={handleAddGalleryImage} className="bg-white text-black font-bold px-6 py-3 rounded-xl whitespace-nowrap">إضافة للصورة</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map(img => (
              <div key={img.id} className="relative group">
                <img src={img.image_url} alt="work" className="w-full h-24 object-cover rounded-lg border border-neutral-700" />
                <button onClick={() => handleDeleteGallery(img.id)} className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded">حذف</button>
              </div>
            ))}
          </div>
        </div>

        {/* قائمة الانتظار */}
        <div>
          <h2 className="text-xl font-bold mb-4">📋 قائمة الانتظار ({waitingList.length})</h2>
          {waitingList.length === 0 ? (
            <p className="text-gray-500 bg-black p-4 rounded-xl border border-neutral-800 text-center">لا توجد طلبات في قائمة الانتظار.</p>
          ) : (
            <div className="space-y-3">
              {waitingList.map(item => (
                <div key={item.id} className="p-4 bg-black border border-neutral-800 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{item.customer_name} - <span className="text-yellow-400" dir="ltr">{item.customer_phone}</span></p>
                    <p className="text-gray-400 text-sm">ملاحظة: {item.requested_note}</p>
                  </div>
                  <button onClick={() => handleDeleteWaiting(item.id)} className="bg-neutral-800 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg font-bold">إزالة</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}