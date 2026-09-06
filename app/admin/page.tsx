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
  
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // الساعات والدقائق لإضافة دور جديد
  const [newHour, setNewHour] = useState("10");
  const [newMinute, setNewMinute] = useState("00");

  // إعدادات التوليد للشهر
  const [genStartH, setGenStartH] = useState("10");
  const [genStartM, setGenStartM] = useState("00");
  const [genEndH, setGenEndH] = useState("20");
  const [genEndM, setGenEndM] = useState("00");
  const [genInterval, setGenInterval] = useState(90);

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
    setSelectedSlotIds([]);
  };

  async function handleAddSlotForDay() {
    if (!selectedDateStr) return alert("الرجاء اختيار اليوم من التقويم أولاً!");
    const dateTimeString = `${selectedDateStr}T${newHour}:${newMinute}:00`;
    
    const { error } = await supabase.from("available_slots").insert([{ date_time: dateTimeString }]);
    if (!error) {
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

  const toggleSlotSelection = (id: string) => {
    if (selectedSlotIds.includes(id)) {
      setSelectedSlotIds(selectedSlotIds.filter(item => item !== id));
    } else {
      setSelectedSlotIds([...selectedSlotIds, id]);
    }
  };

  async function handleDeleteSelectedSlots() {
    if (selectedSlotIds.length === 0) return alert("الرجاء تحديد دور واحد على الأقل للحذف!");
    if (!confirm(`هل أنت متأكدة من حذف ${selectedSlotIds.length} دور المحددة؟`)) return;

    const { error } = await supabase.from("available_slots").delete().in("id", selectedSlotIds);
    if (!error) {
      setSelectedSlotIds([]);
      fetchSlots();
      alert("✨ تم حذف الأدوار المحددة بنجاح!");
    } else {
      alert("حدث خطأ أثناء الحذف.");
    }
  }

  async function handleDeleteAllForDay() {
    if (!selectedDateStr) return;
    const idsToDelete = selectedDaySlots.map(s => s.id);
    if (idsToDelete.length === 0) return alert("لا توجد أدوار في هذا اليوم للحذف.");
    
    if (!confirm(`هل أنت متأكدة من حذف كافة أدوار يوم ${selectedDateStr}؟`)) return;

    const { error } = await supabase.from("available_slots").delete().in("id", idsToDelete);
    if (!error) {
      setSelectedSlotIds([]);
      fetchSlots();
      alert(`✨ تم حذف كافة أدوار يوم ${selectedDateStr} بنجاح!`);
    } else {
      alert("حدث خطأ أثناء الحذف.");
    }
  }

  async function handleCustomGenerateMonthSlots() {
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    let times: string[] = [];
    let startMinutes = Number(genStartH) * 60 + Number(genStartM);
    let endMinutes = Number(genEndH) * 60 + Number(genEndM);
    let interval = Number(genInterval);

    while (startMinutes <= endMinutes) {
      let h = Math.floor(startMinutes / 60);
      let m = startMinutes % 60;
      let timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      times.push(timeStr);
      startMinutes += interval;
    }

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
      alert(`✨ تم توليد مواعيد الشهر كاملة حسب اختيارك بنجاح! (${monthNamesEn[month]})`);
      fetchSlots();
    } else {
      alert("حدث خطأ أثناء التوليد.");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file);

    if (uploadError) {
      alert("خطأ في رفع الصورة، تأكد من إنشاء Bucket باسم 'gallery' في Supabase Storage.");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase.from("gallery").insert([{ image_url: publicUrl }]);
    
    setUploading(false);
    if (!insertError) {
      fetchGallery();
      alert("✨ تم رفع الصورة وإضافتها للمعرض بنجاح!");
    } else {
      alert("تم رفع الصورة لكن حدث خطأ في حفظها بقاعدة البيانات.");
    }
  }

  async function handleDeleteGallery(id: string) {
    await supabase.from("gallery").delete().eq("id", id);
    fetchGallery();
  }

  async function handleDeleteWaiting(id: string) {
    await supabase.from("waiting_list").delete().eq("id", id);
    fetchWaitingList();
  }

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutesList = ["00", "15", "30", "45"];

  if (!isAuthenticated) {
    return (
      <main dir="rtl" className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-neutral-900 border-2 border-yellow-500 p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2 text-yellow-400">لوحة تحكم ريتا 👑</h1>
          <p className="text-gray-400 mb-6 text-sm">أدخل كلمة المرور</p>
          <input 
            type="password" placeholder="كلمة السر..." value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-black border-2 border-yellow-500/50 rounded-xl mb-4 text-center text-white outline-none"
          />
          <button 
            onClick={() => { 
              if (password === "reta2026") {
                setIsAuthenticated(true);
                alert("👑 تاج راسك غسونه ✨");
              } else {
                alert("خطأ!");
              }
            }} 
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400"
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
        
        <div className="bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-yellow-600/20 border border-yellow-500/40 p-4 rounded-2xl mb-6 text-center shadow-lg">
          <p className="text-xl font-extrabold text-yellow-400 tracking-wider animate-pulse">👑 تاج راسك غسونه 👑</p>
        </div>

        <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">لوحة تحكم ريتا ⚡</h1>
          <button onClick={() => setIsAuthenticated(false)} className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold text-sm">خروج</button>
        </div>
        
        {/* إعدادات توليد الشهر */}
        <div className="bg-neutral-800 border border-yellow-500/30 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold mb-3 text-yellow-400">✨ توليد شهر كامل حسب اختيارك (نظام 24 ساعة)</h2>
          <p className="text-gray-300 text-sm mb-4">حددي ساعات العمل والفاصل الزمني بين الأدوار، وسيتم تطبيقها على كل أيام الشهر:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">يبدأ العمل الساعة:</label>
              <div className="flex gap-2">
                <select value={genStartH} onChange={(e) => setGenStartH(e.target.value)} className="w-1/2 p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={genStartM} onChange={(e) => setGenStartM(e.target.value)} className="w-1/2 p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">ينتهي العمل الساعة:</label>
              <div className="flex gap-2">
                <select value={genEndH} onChange={(e) => setGenEndH(e.target.value)} className="w-1/2 p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={genEndM} onChange={(e) => setGenEndM(e.target.value)} className="w-1/2 p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">المدة بين كل دور:</label>
              <select value={genInterval} onChange={(e) => setGenInterval(Number(e.target.value))} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                <option value={60}>ساعة واحدة (60 دقيقة)</option>
                <option value={90}>ساعة ونصف (90 دقيقة)</option>
                <option value={120}>ساعتان (120 دقيقة)</option>
              </select>
            </div>
          </div>

          <button onClick={handleCustomGenerateMonthSlots} className="w-full bg-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-md hover:bg-yellow-400">
            توليد جدول الشهر بالكامل حسب إعداداتك 🚀
          </button>
        </div>

        {/* تقويم ريتا التفاعلي */}
        <div className="bg-black p-6 rounded-2xl border border-neutral-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDateStr(null); }} className="text-yellow-400 px-3 py-1 bg-neutral-900 rounded-lg">‹</button>
            <h2 className="text-lg font-bold text-yellow-400">{monthNamesEn[month]} {year}</h2>
            <button onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDateStr(null); }} className="text-yellow-400 px-3 py-1 bg-neutral-900 rounded-lg">›</button>
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
                    ? "bg-yellow-500 text-black shadow-lg scale-105" 
                    : "bg-neutral-900 text-yellow-400 border border-neutral-800 hover:border-yellow-500"
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
          <div className="bg-black border border-yellow-500/30 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">إدارة أدوار يوم: <span className="text-yellow-400">{selectedDateStr}</span></h2>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
              <div className="flex gap-2 w-full sm:w-auto">
                {/* قائمة الساعات (اليسار) وقائمة الدقائق (اليمين) لتبدو طبيعية وواضحة */}
                <select value={newHour} onChange={(e) => setNewHour(e.target.value)} className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="text-white font-bold self-center">:</span>
                <select value={newMinute} onChange={(e) => setNewMinute(e.target.value)} className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-yellow-400 font-bold">
                  {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <button onClick={handleAddSlotForDay} className="w-full sm:w-auto bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400">＋ إضافة دور جديد</button>
            </div>

            {/* أزرار الحذف الجماعي */}
            {selectedDaySlots.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6 p-4 bg-neutral-900 border border-neutral-800 rounded-xl justify-between items-center">
                <span className="text-sm text-gray-300">الأدوار المحددة للحذف: {selectedSlotIds.length}</span>
                <div className="flex gap-2">
                  <button onClick={handleDeleteSelectedSlots} className="bg-red-900 hover:bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-lg">
                    🗑️ حذف المحددة
                  </button>
                  <button onClick={handleDeleteAllForDay} className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg">
                    ⚠️ حذف كافة أدوار هذا اليوم
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {selectedDaySlots.length === 0 ? (
                <p className="text-gray-400 text-sm">لا توجد أدوار مضافة في هذا اليوم.</p>
              ) : (
                selectedDaySlots.map(slot => {
                  // استخراج الوقت مباشرة من النص (YYYY-MM-DDTHH:mm:ss) بدون تحويل زمني
                  const timeStr = slot.date_time.split('T')[1]?.substring(0, 5) || "";
                  const isChecked = selectedSlotIds.includes(slot.id);
                  return (
                    <div key={slot.id} className={`p-4 rounded-xl border transition-all flex flex-col gap-2 ${isChecked ? 'bg-neutral-800 border-yellow-500' : 'bg-neutral-900 border-neutral-800'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={isChecked} 
                            onChange={() => toggleSlotSelection(slot.id)}
                            className="w-5 h-5 accent-yellow-500 cursor-pointer"
                          />
                          <span className="font-bold text-lg text-yellow-400">{timeStr}</span>
                          {slot.is_booked ? <span className="bg-yellow-500 text-black font-extrabold text-xs px-2.5 py-1 rounded">محجوز 🔒</span> : <span className="bg-neutral-800 text-gray-300 text-xs px-2.5 py-1 rounded">متاح ✅</span>}
                        </div>
                        <button onClick={() => handleDeleteSlot(slot.id)} className="bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-xs px-3 py-1.5 rounded-lg font-bold">حذف فردي</button>
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

        {/* رفع الصور */}
        <div className="bg-black border border-neutral-800 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold mb-4 text-yellow-400">📸 رفع صور أعمال ريتا (من الجهاز/الهاتف)</h2>
          <div className="mb-4">
            <label className="block w-full border-2 border-dashed border-neutral-700 hover:border-yellow-500 p-6 rounded-xl text-center cursor-pointer bg-neutral-900 transition-all">
              <span className="text-gray-300 font-bold block mb-1">اضغطي هنا لاختيار صورة من هاتفك أو جهازك 📁</span>
              <span className="text-gray-500 text-xs">يدعم JPG, PNG بكل الأحجام</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploading && <p className="text-yellow-400 text-center mt-2 font-bold animate-pulse">جاري رفع الصورة... ⏳</p>}
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
          <h2 className="text-xl font-bold mb-4 text-yellow-400">📋 قائمة الانتظار ({waitingList.length})</h2>
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