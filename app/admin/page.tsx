"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// الاتصال بقاعدة البيانات
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
    const { data, error } = await supabase
      .from("available_slots")
      .select("*")
      .order("date_time", { ascending: true });
    if (data) setSlots(data);
  }

  async function handleAddSlot() {
    if (!newDate || !newTime) return alert("الرجاء اختيار التاريخ والوقت");
    
    const dateTimeString = `${newDate}T${newTime}:00`;
    
    const { error } = await supabase
      .from("available_slots")
      .insert([{ date_time: dateTimeString }]);
      
    if (error) alert("حدث خطأ أثناء الإضافة!");
    else {
      setNewDate("");
      setNewTime("");
      fetchSlots();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكدة من حذف هذا الموعد؟")) return;
    const { error } = await supabase.from("available_slots").delete().eq("id", id);
    if (!error) fetchSlots();
  }

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-sm border-t-8 border-gray-800">
          <h1 className="text-2xl font-bold mb-2">لوحة تحكم ريتا 👑</h1>
          <p className="text-gray-500 mb-6">الرجاء إدخال كلمة المرور</p>
          <input 
            type="password" 
            placeholder="كلمة السر..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 rounded-xl mb-4 text-center focus:outline-none focus:border-pink-500"
          />
          <button 
            onClick={() => {
              if (password === "reta2026") setIsAuthenticated(true);
              else alert("كلمة السر خاطئة!");
            }}
            className="w-full bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            دخول
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border-t-8 border-pink-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex justify-between items-center">
          <span>إدارة المواعيد 💅</span>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">تسجيل خروج</button>
        </h1>
        
        <div className="bg-pink-50 p-6 rounded-xl mb-8 border border-pink-200 shadow-sm">
          <h2 className="text-xl font-bold text-pink-700 mb-4">إضافة موعد جديد</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="p-3 border rounded-xl w-full text-gray-700 focus:outline-none focus:border-pink-400" />
            <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="p-3 border rounded-xl w-full text-gray-700 focus:outline-none focus:border-pink-400" />
          </div>
          <button onClick={handleAddSlot} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-pink-600 transition-all shadow-md">
            + إضافة للجدول
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-4">المواعيد الموجودة ({slots.length})</h2>
          {slots.length === 0 ? (
            <p className="text-gray-500 text-center py-4 bg-gray-100 rounded-xl">لا يوجد مواعيد مضافة حالياً.</p>
          ) : (
            <div className="space-y-3">
              {slots.map(slot => {
                const d = new Date(slot.date_time);
                return (
                  <div key={slot.id} className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border rounded-xl shadow-sm">
                    <div className="mb-3 sm:mb-0 text-center sm:text-right">
                      <span className="font-bold text-lg inline-block w-24">{d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-gray-600 ml-4 inline-block">{d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {slot.is_booked ? (
                        <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-sm">محجوز 🔒</span>
                      ) : (
                        <span className="text-green-500 font-bold bg-green-50 px-2 py-1 rounded text-sm">متاح ✅</span>
                      )}
                    </div>
                    <button onClick={() => handleDelete(slot.id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-all w-full sm:w-auto">
                      حذف
                    </button>
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