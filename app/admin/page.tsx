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

  const [newDate, setNewDate] = useState("");
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
    if (data) setSlots(data);
  }

  async function fetchWaitingList() {
    const { data } = await supabase.from("waiting_list").select("*").order("created_at", { ascending: false });
    if (data) setWaitingList(data);
  }

  async function fetchGallery() {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setGallery(data);
  }

  async function handleAddSlot() {
    if (!newDate || !newTime) return alert("اختر التاريخ والوقت");
    const { error } = await supabase.from("available_slots").insert([{ date_time: `${newDate}T${newTime}:00` }]);
    if (!error) { setNewDate(""); setNewTime(""); fetchSlots(); }
  }

  async function handleDeleteSlot(id: string) {
    if (!confirm("هل أنت متأكدة من حذف هذا الموعد؟")) return;
    await supabase.from("available_slots").delete().eq("id", id);
    fetchSlots();
  }

  async function handleAddGalleryImage() {
    if (!newImgUrl) return alert("الرجاء إدخال رابط الصورة (Image URL)");
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
        
        {/* 1. إضافة موعد */}
        <div className="bg-black border border-neutral-800 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold mb-4">➕ إضافة أوقات جديدة (شهري/أسبوعي)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white" />
            <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white" />
          </div>
          <button onClick={handleAddSlot} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200">إضافة الموعد</button>
        </div>

        {/* 2. إدارة صور المعرض */}
        <div className="bg-black border border-neutral-800 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold mb-4">📸 إضافة صور لمعرض الأعمال</h2>
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="ضع رابط الصورة هنا (Image URL)..." value={newImgUrl} onChange={(e) => setNewImgUrl(e.target.value)} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-sm" />
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

        {/* 3. جدول المواعيد والحجوزات (مع تفاصيل الخدمة) */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">📅 جدول المواعيد والحجوزات ({slots.length})</h2>
          <div className="space-y-4">
            {slots.map(slot => {
              const d = new Date(slot.date_time);
              return (
                <div key={slot.id} className="p-4 bg-black border border-neutral-800 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <div>
                      <span className="font-bold text-lg">{d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-gray-400 text-sm ml-3">{d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {slot.is_booked ? <span className="bg-white text-black font-extrabold text-xs px-2.5 py-1 rounded mr-3">محجوز 🔒</span> : <span className="bg-neutral-800 text-gray-300 text-xs px-2.5 py-1 rounded mr-3">متاح ✅</span>}
                    </div>
                    <button onClick={() => handleDeleteSlot(slot.id)} className="bg-neutral-800 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg font-bold">حذف</button>
                  </div>
                  
                  {slot.is_booked && slot.bookings && slot.bookings.length > 0 && (
                    <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div><span className="text-gray-500 text-xs">الزبونة:</span> <p className="font-bold text-white">{slot.bookings[0].customer_name}</p></div>
                      <div><span className="text-gray-500 text-xs">الواتساب:</span> <p className="font-bold text-white" dir="ltr">{slot.bookings[0].customer_phone}</p></div>
                      <div><span className="text-gray-500 text-xs">الخدمة المختارة:</span> <p className="font-bold text-yellow-400">{slot.bookings[0].service_name}</p></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. قائمة الانتظار (Waiting List) */}
        <div>
          <h2 className="text-xl font-bold mb-4">📋 قائمة الانتظار (Waiting List) ({waitingList.length})</h2>
          {waitingList.length === 0 ? (
            <p className="text-gray-500 bg-black p-4 rounded-xl border border-neutral-800 text-center">لا توجد طلبات في قائمة الانتظار حالياً.</p>
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