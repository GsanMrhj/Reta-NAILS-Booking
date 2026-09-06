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
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchSlots();
  }, [isAuthenticated]);

  async function fetchSlots() {
    const { data } = await supabase
      .from("available_slots")
      .select(`
        id, date_time, is_booked,
        bookings ( customer_name, customer_phone )
      `)
      .order("date_time", { ascending: true });
    if (data) setSlots(data);
  }

  async function handleAddSlot() {
    if (!newDate || !newTime) return alert("الرجاء اختيار التاريخ والوقت");
    const dateTimeString = `${newDate}T${newTime}:00`;
    const { error } = await supabase.from("available_slots").insert([{ date_time: dateTimeString }]);
    if (!error) { setNewDate(""); setNewTime(""); fetchSlots(); }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكدة من حذف هذا الموعد؟")) return;
    const { error } = await supabase.from("available_slots").delete().eq("id", id);
    if (!error) fetchSlots();
  }

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-neutral-900 border-2 border-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2 text-white">لوحة تحكم ريتا 👑</h1>
          <p className="text-gray-400 mb-6 text-sm">أدخل كلمة المرور للمتابعة</p>
          <input 
            type="password" 
            placeholder="كلمة السر..." 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-black border-2 border-white rounded-xl mb-4 text-center text-white placeholder-gray-500 focus:outline-none"
          />
          <button 
            onClick={() => { if (password === "reta2026") setIsAuthenticated(true); else alert("كلمة المرور خاطئة!"); }} 
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            دخول النظام
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
        
        {/* رأس الصفحة */}
        <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">لوحة تحكم ريتا ⚡</h1>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="bg-white text-black text-sm px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            تسجيل خروج
          </button>
        </div>
        
        {/* إضافة موعد */}
        <div className="bg-black border border-neutral-800 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold text-white mb-4">➕ إضافة موعد متاح جديد</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input 
              type="date" 
              value={newDate} 
              onChange={(e) => setNewDate(e.target.value)} 
              className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none" 
            />
            <input 
              type="time" 
              value={newTime} 
              onChange={(e) => setNewTime(e.target.value)} 
              className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none" 
            />
          </div>
          <button 
            onClick={handleAddSlot} 
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            إضافة الموعد للجدول
          </button>
        </div>

        {/* عرض المواعيد والحجوزات */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">📅 جدول المواعيد ({slots.length})</h2>
          {slots.length === 0 ? (
            <p className="text-gray-400 text-center py-6 bg-black border border-neutral-800 rounded-xl">لا توجد مواعيد مضافة حالياً.</p>
          ) : (
            <div className="space-y-4">
              {slots.map(slot => {
                const d = new Date(slot.date_time);
                return (
                  <div key={slot.id} className="p-4 bg-black border border-neutral-800 rounded-xl shadow-inner flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-white">{d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-gray-400 text-sm">{d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        {slot.is_booked ? (
                          <span className="bg-white text-black font-extrabold text-xs px-2.5 py-1 rounded">محجوز 🔒</span>
                        ) : (
                          <span className="bg-neutral-800 text-gray-300 font-bold text-xs px-2.5 py-1 rounded">متاح ✅</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDelete(slot.id)} 
                        className="bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-bold transition-all border border-neutral-700"
                      >
                        حذف الموعد
                      </button>
                    </div>
                    
                    {/* تفاصيل الزبونة (تظهر فقط إذا كان محجوزاً بوضوح تام) */}
                    {slot.is_booked && slot.bookings && slot.bookings.length > 0 && (
                      <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-lg flex flex-col sm:flex-row justify-between gap-2 mt-1">
                        <div>
                          <span className="text-gray-500 text-xs">اسم الزبونة:</span> 
                          <p className="font-bold text-white">{slot.bookings[0].customer_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">رقم الواتساب:</span> 
                          <p className="font-bold text-white tracking-wider" dir="ltr">{slot.bookings[0].customer_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}