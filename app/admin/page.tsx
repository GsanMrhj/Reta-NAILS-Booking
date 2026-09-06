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
    // التعديل السحري: سحب الأوقات المتاحة مع بيانات الزبونة من جدول الحجوزات
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
      <main dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-sm border-t-8 border-gray-800">
          <h1 className="text-2xl font-bold mb-2">لوحة تحكم ريتا 👑</h1>
          <p className="text-gray-500 mb-6">الرجاء إدخال كلمة المرور</p>
          <input type="password" placeholder="كلمة السر..." value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-2 rounded-xl mb-4 text-center focus:border-pink-500"/>
          <button onClick={() => { if (password === "reta2026") setIsAuthenticated(true); else alert("خطأ!"); }} className="w-full bg-gray-800 text-white px-6 py-3 rounded-xl font-bold">دخول</button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border-t-8 border-pink-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex justify-between items-center">
          <span>إدارة المواعيد 💅</span>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg">خروج</button>
        </h1>
        
        <div className="bg-pink-50 p-6 rounded-xl mb-8 border border-pink-200">
          <h2 className="text-xl font-bold text-pink-700 mb-4">إضافة موعد جديد</h2>
          <div className="flex gap-4 mb-4">
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="p-3 border rounded-xl w-full" />
            <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="p-3 border rounded-xl w-full" />
          </div>
          <button onClick={handleAddSlot} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold w-full">إضافة للجدول</button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-4">المواعيد ({slots.length})</h2>
          <div className="space-y-4">
            {slots.map(slot => {
              const d = new Date(slot.date_time);
              return (
                <div key={slot.id} className="p-4 bg-white border-2 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3 mb-3">
                    <div>
                      <span className="font-bold text-lg inline-block w-24">{d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-gray-600 ml-4 inline-block">{d.toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      {slot.is_booked ? (
                        <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">محجوز 🔒</span>
                      ) : (
                        <span className="text-green-500 font-bold bg-green-50 px-2 py-1 rounded">متاح ✅</span>
                      )}
                    </div>
                    <button onClick={() => handleDelete(slot.id)} className="text-red-500 bg-red-50 px-4 py-2 rounded-lg font-bold">حذف</button>
                  </div>
                  
                  {/* هنا يظهر اسم الزبونة ورقمها لريتا فقط إذا كان الموعد محجوز */}
                  {slot.is_booked && slot.bookings && slot.bookings.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg flex flex-col sm:flex-row gap-6">
                      <div><span className="text-gray-500 text-sm">اسم الزبونة:</span> <p className="font-bold text-lg text-blue-900">{slot.bookings[0].customer_name}</p></div>
                      <div><span className="text-gray-500 text-sm">رقم الهاتف:</span> <p className="font-bold text-lg text-blue-900" dir="ltr">{slot.bookings[0].customer_phone}</p></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  );
}